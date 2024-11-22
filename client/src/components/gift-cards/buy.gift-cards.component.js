import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { GlobalContext } from "@/contexts/global.context";
import InfosFormGiftCardsComponent from "./infos-form.gift-cards.component";
import PaymentFormGiftCardsComponent from "./payment-form.gift-cards.component";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default function BuyGiftCardsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { restaurantContext } = useContext(GlobalContext);

  const [giftCard, setGiftCard] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    beneficiary: "",
    sendEmail: "",
    comment: "",
    hidePrice: false,
    sendCopy: false,
    copyEmail: "",
  });

  useEffect(() => {
    if (restaurantContext?.restaurantData) {
      const foundGiftCard = restaurantContext.restaurantData.giftCards.find(
        (card) => card._id === id
      );
      if (foundGiftCard) {
        setGiftCard(foundGiftCard);
      } else {
        router.push("/gift-cards");
      }
    }
  }, [id, restaurantContext, router]);

  if (!giftCard) {
    return <p>Chargement des données...</p>;
  }

  const handleFormSubmit = (data) => {
    console.log("Données soumises :", data);
    setCurrentStep(2); // Passer à l'étape Paiement
  };

  const handleFormChange = (updatedData) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <InfosFormGiftCardsComponent
            onSubmit={handleFormSubmit}
            onChange={handleFormChange}
            formData={formData}
          />
        );
      case 2:
        return (
          <Elements stripe={stripePromise}>
            <PaymentFormGiftCardsComponent
              amount={giftCard.value}
              onPaymentSuccess={() => setCurrentStep(3)}
            />
          </Elements>
        );
      case 3:
        return (
          <div>
            <p>
              Votre achat de carte cadeau a été validé et la carte a été envoyée
              par mail !
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col tablet:flex-row gap-8 p-6"
      style={{
        fontFamily: "'Abel', sans-serif",
      }}
    >
      {/* Informations sur la carte cadeau */}
      <div className="flex-1 border rounded-lg p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4">Carte cadeau</h1>
        {giftCard.description && (
          <p className="text-lg mb-2">
            <span className="font-semibold">Description :</span>{" "}
            {giftCard.description}
          </p>
        )}

        {!formData.hidePrice && (
          <p className="text-lg mb-2">
            <span className="font-semibold">Valeur :</span>{" "}
            {`${giftCard.value} €`}
          </p>
        )}
        <p className="text-lg mb-2">
          <span className="font-semibold">Pour :</span>{" "}
          {formData.beneficiary || "Non renseigné"}
        </p>
        {formData.comment && (
          <p className="text-lg mb-2">
            <span className="font-semibold">Commentaire :</span>{" "}
            {formData.comment}
          </p>
        )}
        {formData.sendCopy && formData.yourEmail && (
          <p className="text-lg mb-2">
            <span className="font-semibold">Email copie :</span>{" "}
            {formData.yourEmail}
          </p>
        )}
      </div>

      {/* Étapes */}
      <div className="flex-1 border rounded-lg p-6 bg-white shadow-md">
        <div className="flex items-center mb-6">
          {["Informations", "Paiement", "Validation"].map((step, index) => (
            <div key={index} className="flex items-center relative justify-between w-full">
              <span
                className={`text-center w-full ${
                  currentStep === index + 1
                    ? "text-grey font-bold"
                    : "text-grey text-opacity-50"
                } ${currentStep === 2 && index === 0 ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (currentStep === 2 && index === 0) {
                    setCurrentStep(1); // Retour à l'étape 1 depuis l'étape 2
                  }
                }}
              >
                {step}
              </span>
              
              {index < 2 && (
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 left-1/2 w-full h-[2px] transition-all duration-200 ${
                    currentStep > index + 1
                      ? "bg-grey"
                      : "bg-extraWhite"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
}
