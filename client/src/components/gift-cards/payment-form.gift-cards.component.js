import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function PaymentFormGiftCardsComponent({
  onPaymentSuccess,
  amount,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Appel à l'API pour créer un PaymentIntent
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        setErrorMessage(error);
        setIsLoading(false);
        return;
      }

      // Confirmer le paiement
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
        onPaymentSuccess();
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

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
