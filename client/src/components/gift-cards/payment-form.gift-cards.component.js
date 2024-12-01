import axios from "axios";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { generateGiftCardPdf } from "@/_assets/utils/generate-gift-card-pdf.utils";

export default function PaymentFormGiftCardsComponent(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
  });

  const sendPurchaseData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

    try {
      const response = await axios.post(
        `${apiUrl}/restaurants/${restaurantId}/gifts/${props.giftId}/purchase`,
        props.formData
      );

      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi des données au backend :", error);
      throw error;
    }
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
        beneficiaryEmail: data.beneficiaryEmail,
        senderName: data.senderName,
        value: data.value,
        description: data.description,
        code: data.code,
        message: data.message,
        validUntil: data.validUntil,
        attachment: pdfContent,
        hidePrice: props.formData.hidePrice,
        copyEmail: props.formData.copyEmail,
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

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: props.amount * 100 }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        setErrorMessage(error);
        setIsLoading(false);
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
      } else if (result.paymentIntent.status === "succeeded") {
        const purchaseData = await sendPurchaseData();

        await sendGiftCardEmail({
          beneficiaryFirstName: props.formData.beneficiaryFirstName,
          beneficiaryLastName: props.formData.beneficiaryLastName,
          code: purchaseData.purchaseCode,
          message: props.formData.comment,
          description: props.giftCard.description,
          validUntil: purchaseData.validUntil,
          value: props.amount,
          beneficiaryEmail: props.formData.sendEmail,
          senderName: props.formData.sender,
        });
        props.onPaymentSuccess();
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setIsLoading(false);
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
        "::placeholder": {
          color: "#9da3ae",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Prénom et Nom */}
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

      {/* Numéro de carte */}
      <div className="border rounded-md bg-extraWhite p-3 box-border">
        <CardNumberElement id="cardNumber" options={stripeElementStyle} />
      </div>

      {/* Date d'expiration et CVC */}
      <div className="flex gap-4">
        <div className="border rounded-md bg-extraWhite p-3 box-border w-24">
          <CardExpiryElement id="cardExpiry" options={stripeElementStyle} />
        </div>

        <div className="border rounded-md bg-extraWhite p-3 box-border w-24">
          <CardCvcElement id="cardCvc" options={stripeElementStyle} />
        </div>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full py-2 px-4 rounded-lg text-white text-lg bg-grey"
      >
        {isLoading ? "Traitement..." : "Payer"}
      </button>
    </form>
  );
}
