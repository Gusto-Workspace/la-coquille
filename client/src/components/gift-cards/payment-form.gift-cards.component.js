import { useEffect, useRef, useState } from "react";

// AXIOS
import axios from "axios";

// STRIPE
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// UTILS
import { generateGiftCardPdf } from "@/_assets/utils/generate-gift-card-pdf.utils";

export default function PaymentFormGiftCardsComponent(props) {
  const stripe = useStripe();
  const elements = useElements();

  const submitLockRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isPreparingPayment, setIsPreparingPayment] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [clientSecret, setClientSecret] = useState(null);

  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
  });

  // ✅ Create the PaymentIntent ONLY ONCE (or when amount / gift changes)
  useEffect(() => {
    let cancelled = false;

    async function createPaymentIntentOnce() {
      try {
        setIsPreparingPayment(true);
        setErrorMessage("");
        setClientSecret(null);

        const response = await fetch("/api/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            amount: props.amount * 100,
            restaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
            giftId: props.giftId,
          }),
        });

        const json = await response.json();

        if (cancelled) return;

        if (!response.ok || json.error) {
          setErrorMessage(
            json.error || "Erreur lors de la préparation du paiement."
          );
          setClientSecret(null);
          return;
        }

        setClientSecret(json.clientSecret);
      } catch (e) {
        if (!cancelled) {
          setErrorMessage("Erreur lors de la préparation du paiement.");
          setClientSecret(null);
        }
      } finally {
        if (!cancelled) setIsPreparingPayment(false);
      }
    }

    createPaymentIntentOnce();

    return () => {
      cancelled = true;
    };
  }, [props.amount, props.giftId]);

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

  const verifyPaymentProof = async (paymentIntentId) => {
    const response = await fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        paymentIntentId,
        amount: props.amount * 100,
        restaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
        giftId: props.giftId,
      }),
    });

    const json = await response.json();

    if (!response.ok || json.error) {
      throw new Error(json.error || "Paiement non vérifié.");
    }

    // attendu : { timestamp, signature, payload }
    if (!json.timestamp || !json.signature) {
      throw new Error("Preuve de paiement invalide.");
    }

    return json;
  };

  const sendPurchaseData = async (piIdFromConfirm, proof) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

    const validUntil = computeValidUntil();

    const payload = {
      ...props.formData,
      validUntil: validUntil.toISOString(),
      paymentIntentId: piIdFromConfirm,
      amount: props.amount * 100,
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
    try {
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
        throw new Error("Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
    }
  };

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

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: `${formDetails.firstName} ${formDetails.lastName}`,
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const confirmedPiId = result.paymentIntent.id;

        // ✅ 1) Demande une preuve serveur (Stripe vérifié côté site client)
        const proof = await verifyPaymentProof(confirmedPiId);

        // ✅ 2) Envoie la purchase avec preuve (headers) vers Gusto
        const purchaseData = await sendPurchaseData(confirmedPiId, proof);

        // ✅ 3) Email + success UI
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

        props.onPaymentSuccess();
      }
    } catch (error) {
      setErrorMessage(
        error?.message || "Une erreur est survenue, veuillez réessayer."
      );
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

  const disablePayButton =
    !stripe || isLoading || isPreparingPayment || !clientSecret;

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
            className="border rounded-md w-full py-2 px-3 leading-[1.5]"
            required
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
            className="border rounded-md w-full py-2 px-3 leading-[1.5]"
            required
          />
        </div>
      </div>

      <div className="border rounded-md bg-extraWhite p-3 box-border">
        <CardNumberElement id="cardNumber" options={stripeElementStyle} />
      </div>

      <div className="flex gap-4">
        <div className="border rounded-md bg-extraWhite p-3 box-border w-24">
          <CardExpiryElement id="cardExpiry" options={stripeElementStyle} />
        </div>

        <div className="border rounded-md bg-extraWhite p-3 box-border w-24">
          <CardCvcElement id="cardCvc" options={stripeElementStyle} />
        </div>
      </div>

      {isPreparingPayment && (
        <p className="text-grey text-sm">Préparation du paiement…</p>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button
        type="submit"
        disabled={disablePayButton}
        className="w-full py-2 px-4 rounded-lg text-white text-lg bg-grey disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Traitement..." : "Payer"}
      </button>
    </form>
  );
}
