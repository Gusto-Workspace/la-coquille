import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { generateGiftCardPdf } from "@/_assets/utils/generate-gift-card-pdf.utils";

function safeJsonParse(v, fallback = null) {
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

function makeCheckoutId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `chk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function PaymentFormGiftCardsComponent(props) {
  const stripe = useStripe();
  const elements = useElements();

  const submitLockRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isPreparingPayment, setIsPreparingPayment] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
  });

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;
  const amountCents = props.amount * 100;

  // clé unique par "commande"
  const LS_KEY = `gm_gift_checkout:${restaurantId}:${props.giftId}:${amountCents}`;

  const readCheckout = () => {
    if (typeof window === "undefined") return null;
    return safeJsonParse(localStorage.getItem(LS_KEY), null);
  };

  const writeCheckout = (data) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  };

  const clearCheckout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LS_KEY);
  };

  // ✅ lock UI si on refresh pendant "confirming"
  const [isFinalizing, setIsFinalizing] = useState(() => {
    if (typeof window === "undefined") return false;
    const c = safeJsonParse(localStorage.getItem(LS_KEY), null);
    return c?.state === "confirming";
  });

  const computeValidUntil = () => {
    const validityEndEnv = process.env.NEXT_PUBLIC_GIFT_VALID_UNTIL;
    const validityMonthsEnv = process.env.NEXT_PUBLIC_GIFT_VALIDITY_MONTHS;

    let validUntil;

    if (validityEndEnv) {
      const [year, month, day] = validityEndEnv.split("-").map(Number);
      validUntil = new Date(year, month - 1, day, 23, 59, 59, 999);
    } else {
      const monthsToAdd = validityMonthsEnv
        ? parseInt(validityMonthsEnv, 10) || 6
        : 6;

      validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + monthsToAdd);
      validUntil.setHours(23, 59, 59, 999);
    }

    return validUntil;
  };

  const verifyPaymentProof = async (piId) => {
    const response = await fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        paymentIntentId: piId,
        amount: amountCents,
        restaurantId,
        giftId: props.giftId,
      }),
    });

    const json = await response.json();

    if (!response.ok || json.error) {
      throw new Error(json.error || "Paiement non vérifié.");
    }

    if (!json.timestamp || !json.signature) {
      throw new Error("Preuve de paiement invalide.");
    }

    return json; // {timestamp, signature, payload}
  };

  const sendPurchaseData = async (piId, proof, formDataOverride) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const validUntil = computeValidUntil();

    const payload = {
      ...(formDataOverride || props.formData),
      validUntil: validUntil.toISOString(),
      paymentIntentId: piId,
      amount: amountCents,
    };

    const response = await axios.post(
      `${apiUrl}/restaurants/${restaurantId}/gifts/${props.giftId}/purchase`,
      payload,
      {
        headers: {
          "x-gusto-timestamp": proof.timestamp,
          "x-gusto-signature": proof.signature,
        },
      }
    );

    return response.data;
  };

  const sendGiftCardEmail = async (data) => {
    const pdfContent = await generateGiftCardPdf({
      value: data.value,
      code: data.code,
      validUntil: data.validUntil,
      description: data.description,
      message: data.message,
      senderName: data.senderName,
      hidePrice: props.formData.hidePrice,
      beneficiaryName: `${data.beneficiaryFirstName} ${data.beneficiaryLastName}`,
    });

    const emailData = {
      beneficiaryFirstName: data.beneficiaryFirstName,
      beneficiaryLastName: data.beneficiaryLastName,
      sendEmail: data.sendEmail,
      senderName: data.senderName,
      value: data.value,
      description: data.description,
      code: data.code,
      message: data.message,
      validUntil: data.validUntil,
      attachment: pdfContent,
      hidePrice: props.formData.hidePrice,
    };

    const response = await fetch("/api/send-gift-card-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error("Email non envoyé");
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setIsPreparingPayment(true);
        setErrorMessage("");

        // 1) récupérer/initialiser le checkout local
        let checkout = readCheckout();
        if (!checkout?.checkoutId) {
          checkout = {
            checkoutId: makeCheckoutId(),
            state: "idle", // idle | confirming | done
            createdAt: Date.now(),
            formDataSnapshot: null,
          };
          writeCheckout(checkout);
        }

        // 2) créer (idempotent) le PI
        const response = await fetch("/api/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            amount: amountCents,
            restaurantId,
            giftId: props.giftId,
            checkoutId: checkout.checkoutId,
          }),
        });

        const json = await response.json();
        if (cancelled) return;

        if (!response.ok || json.error) {
          setErrorMessage(
            json.error || "Erreur lors de la préparation du paiement."
          );
          return;
        }

        setClientSecret(json.clientSecret);
        setPaymentIntentId(json.paymentIntentId);

        // stocker PI dans le checkout
        checkout = {
          ...checkout,
          paymentIntentId: json.paymentIntentId,
          clientSecret: json.clientSecret,
        };
        writeCheckout(checkout);

        // 3) Reprise après refresh : si on était en "confirming", on tente de finaliser
        if (checkout.state === "confirming" && checkout.paymentIntentId) {
          setIsFinalizing(true); // ✅ lock UI dès le refresh

          try {
            const proof = await verifyPaymentProof(checkout.paymentIntentId);
            const purchaseData = await sendPurchaseData(
              checkout.paymentIntentId,
              proof,
              checkout.formDataSnapshot || props.formData
            );

            await sendGiftCardEmail({
              beneficiaryFirstName: (
                checkout.formDataSnapshot || props.formData
              ).beneficiaryFirstName,
              beneficiaryLastName: (checkout.formDataSnapshot || props.formData)
                .beneficiaryLastName,
              code: purchaseData.purchaseCode,
              message: (checkout.formDataSnapshot || props.formData).comment,
              description: props.giftCard.description,
              validUntil: purchaseData.validUntil,
              value: props.amount,
              sendEmail: (checkout.formDataSnapshot || props.formData)
                .sendEmail,
              senderName: (checkout.formDataSnapshot || props.formData).sender,
            });

            // terminé -> cleanup
            clearCheckout();
            props.onPaymentSuccess();
          } catch (e) {
            // paiement pas terminé / échec => on repasse idle + unlock
            writeCheckout({ ...checkout, state: "idle" });
            setIsFinalizing(false);
          }
        } else {
          setIsFinalizing(false);
        }
      } catch (e) {
        if (!cancelled) {
          setErrorMessage("Erreur lors de la préparation du paiement.");
        }
        setIsFinalizing(false);
      } finally {
        if (!cancelled) setIsPreparingPayment(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [props.amount, props.giftId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;
    if (submitLockRef.current) return;
    submitLockRef.current = true;

    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!clientSecret) {
        setErrorMessage(
          "Paiement non prêt. Veuillez réessayer dans quelques secondes."
        );
        return;
      }

      const checkout = readCheckout() || {
        checkoutId: makeCheckoutId(),
        createdAt: Date.now(),
      };

      writeCheckout({
        ...checkout,
        state: "confirming",
        createdAt: checkout.createdAt || Date.now(),
        paymentIntentId: paymentIntentId || checkout.paymentIntentId || null,
        clientSecret,
        formDataSnapshot: props.formData,
        emailSent: false,
      });

      setIsFinalizing(true); // ✅ lock UI pendant le process

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: `${formDetails.firstName} ${formDetails.lastName}`,
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Paiement refusé.");
        const c = readCheckout();
        if (c) writeCheckout({ ...c, state: "idle" });
        setIsFinalizing(false); // ✅ unlock
        return;
      }

      const pi = result.paymentIntent;

      if (pi?.status === "succeeded") {
        const confirmedPiId = pi.id;

        const proof = await verifyPaymentProof(confirmedPiId);
        const purchaseData = await sendPurchaseData(confirmedPiId, proof);

        await sendGiftCardEmail({
          beneficiaryFirstName: props.formData.beneficiaryFirstName,
          beneficiaryLastName: props.formData.beneficiaryLastName,
          code: purchaseData.purchaseCode,
          message: props.formData.comment,
          description: props.giftCard.description,
          validUntil: purchaseData.validUntil,
          value: props.amount,
          sendEmail: props.formData.sendEmail,
          senderName: props.formData.sender,
        });

        const c2 = readCheckout();
        if (c2) writeCheckout({ ...c2, emailSent: true });

        clearCheckout();
        props.onPaymentSuccess();
        return;
      }

      const c = readCheckout();
      if (c) writeCheckout({ ...c, state: "idle" });
      setIsFinalizing(false); // ✅ unlock
      setErrorMessage(
        "Le paiement n’a pas pu être finalisé. Veuillez réessayer."
      );
    } catch (error) {
      const msg =
        error?.message ||
        "Une erreur est survenue. Si le paiement a été validé, rafraîchissez la page pour relancer l’envoi de l’email.";

      setErrorMessage(msg);

      const c = readCheckout();
      if (c) {
        const keepConfirming =
          c.state === "confirming" ||
          msg.toLowerCase().includes("email") ||
          msg.toLowerCase().includes("rafraîchissez");

        writeCheckout({ ...c, state: keepConfirming ? "confirming" : "idle" });
        setIsFinalizing(keepConfirming); // ✅ lock si confirming, sinon unlock
      } else {
        setIsFinalizing(false);
      }
    } finally {
      setIsLoading(false);
      submitLockRef.current = false;
    }
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  }

  const stripeElementStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "'Abel', sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "14px",
        "::placeholder": { color: "#9da3ae" },
      },
      invalid: { color: "#fa755a", iconColor: "#fa755a" },
    },
  };

  const disableInputs =
    isFinalizing || isLoading || isPreparingPayment || !clientSecret;

  const stripeElementOptions = {
    ...stripeElementStyle,
    disabled: disableInputs,
  };

  const disablePayButton = !stripe || disableInputs;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex gap-4">
        <div className="w-full">
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Votre prénom"
            value={formDetails.firstName}
            onChange={handleInputChange}
            className="border rounded-md w-full py-2 px-3 leading-[1.5] disabled:opacity-90 disabled:cursor-not-allowed"
            required
            disabled={disableInputs}
          />
        </div>

        <div className="w-full">
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Votre nom"
            value={formDetails.lastName}
            onChange={handleInputChange}
            className="border rounded-md w-full py-2 px-3 leading-[1.5] disabled:opacity-90 disabled:cursor-not-allowed"
            required
            disabled={disableInputs}
          />
        </div>
      </div>

      <div className="border rounded-md bg-extraWhite p-3 box-border">
        <CardNumberElement id="cardNumber" options={stripeElementOptions} />
      </div>

      <div className="flex gap-4">
        <div className="border rounded-md bg-extraWhite p-3 box-border w-24">
          <CardExpiryElement id="cardExpiry" options={stripeElementOptions} />
        </div>

        <div className="border rounded-md bg-extraWhite p-3 box-border w-24">
          <CardCvcElement id="cardCvc" options={stripeElementOptions} />
        </div>
      </div>

      {isPreparingPayment && (
        <p className="text-grey text-sm">Préparation du paiement…</p>
      )}

      {errorMessage && <p className="text-red">{errorMessage}</p>}

      <button
        type="submit"
        disabled={disablePayButton}
        className="w-full py-2 px-4 rounded-lg text-white text-lg bg-grey disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading || isFinalizing ? "Traitement..." : "Payer"}
      </button>
    </form>
  );
}
