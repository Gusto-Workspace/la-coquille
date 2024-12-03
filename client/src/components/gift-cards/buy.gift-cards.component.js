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
    beneficiaryFirstName: "",
    beneficiaryLastName: "",
    sender: "",
    sendEmail: "",
    comment: "",
    hidePrice: false,
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
    return <p className="p-12">Chargement des données...</p>;
  }

  function handleFormSubmit() {
    setCurrentStep(2);
  }

  function handleFormChange(updatedData) {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  }

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
              giftCard={giftCard}
              onPaymentSuccess={() => setCurrentStep(3)}
              formData={formData}
              giftId={giftCard._id}
            />
          </Elements>
        );
      case 3:
        return (
          <div className="flex items-center justify-center text-pretty text-center">
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
      className="flex flex-col desktop:flex-row items-center justify-between gap-12 py-24 max-w-[90%] mx-auto"
      style={{
        fontFamily: "'Abel', sans-serif",
      }}
    >
      <div className="w-[100%] h-auto flex-grow flex items-center">
        <div
          className="rounded-md flex flex-col items-end aspect-[16/9] w-[100%] mx-auto bg-center bg-cover bg-no-repeat shadow-2xl"
          style={{ backgroundImage: "url(/img/assets/bg-gift-card.png" }}
        >
          <div className="w-2/3 flex flex-col desktop:gap-2 items-center justify-center my-auto">
            <h1 className="text-2xl desktop:text-[2vw] font-bold desktop:mb-4">
              Carte cadeau
            </h1>

            <div className="flex flex-col desktop:gap-3 items-center">
              {!formData.hidePrice && (
                <p className="text-xl desktop:text-[1.5vw]">{`${giftCard.value} €`}</p>
              )}

              {giftCard.description && (
                <p className="text-sm desktop:text-[1.2vw] text-center px-4 leading-7">
                  {giftCard.description}
                </p>
              )}

              <p className="text-sm desktop:text-[1.2vw]">
                <span className="text-sm desktop:text-[1vw] text-center italic">Pour :</span>{" "}
                <span>
                  {formData.beneficiaryFirstName} {formData.beneficiaryLastName}
                </span>
              </p>

              {formData.comment && (
                <p className="text-sm desktop:text-[1.2vw] text-center px-2">
                  <span>"{formData.comment}"</span>
                </p>
              )}

              {formData.sender && (
                <p className="text-sm desktop:text-[1.2vw]">
                  <span className="text-sm desktop:text-[1vw] italic">De la part de :</span>{" "}
                  <span>{formData.sender}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Étapes */}
      <div className="w-full rounded-lg p-4 desktop:p-12 bg-white shadow-md">
        <div className="flex items-center mb-6 mx-auto text-center">
          {["Informations", "Paiement", "Validation"].map((step, index) => (
            <div
              key={index}
              className="flex items-center text-center relative justify-between w-full mx-auto"
            >
              <span
                className={`text-center bg-white z-10 w-fit mx-auto px-2 desktop:px-4 ${
                  currentStep > index
                    ? "text-grey"
                    : currentStep === index + 1
                      ? "text-grey font-bold"
                      : "text-grey text-opacity-50"
                } ${currentStep === 2 && index === 0 ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (currentStep === 2 && index === 0) {
                    setCurrentStep(1);
                  }
                }}
              >
                {step}
              </span>

              {index < 2 && (
                <div>
                  <div
                    style={{
                      width: currentStep > index + 1 ? "100%" : "0%",
                      transition: "width 0.5s ease-in-out",
                    }}
                    className={`absolute top-1/2 transform -translate-y-1/2 left-1/2 h-[2px] bg-grey z-[9]`}
                  />
                  <div
                    style={{
                      width: "100%",
                      transition: "width 0.5s ease-in-out",
                    }}
                    className={`absolute top-1/2 transform -translate-y-1/2 left-1/2 h-[2px] bg-extraWhite`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
}
