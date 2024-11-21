import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

export default function BuyGiftCardsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { restaurantContext } = useContext(GlobalContext);

  const [giftCard, setGiftCard] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      beneficiary: "",
      beneficiaryEmail: "",
      comment: "",
      hidePrice: false,
      sendCopy: false,
      yourEmail: "",
    },
  });

  const watchSendCopy = watch("sendCopy");

  useEffect(() => {
    if (restaurantContext?.restaurantData) {
      setIsDataLoaded(true);

      if (id) {
        const foundGiftCard = restaurantContext.restaurantData.giftCards.find(
          (card) => card._id === id
        );

        if (foundGiftCard) {
          setGiftCard(foundGiftCard);
        } else if (isDataLoaded) {
          router.push("/gift-cards");
        }
      }
    }
  }, [id, restaurantContext, router, isDataLoaded]);

  if (!isDataLoaded || !giftCard) {
    return <p>Chargement des données...</p>;
  }

  const onSubmit = (data) => {
    alert(
      `Carte cadeau validée pour ${data.beneficiary}.\nEmail bénéficiaire : ${
        data.beneficiaryEmail
      }.\nCommentaire : ${
        data.comment || "Aucun"
      }.\nPrix ${data.hidePrice ? "masqué" : "visible"}.\nRecevoir une copie : ${
        data.sendCopy ? "Oui" : "Non"
      }.\nVotre email : ${data.yourEmail || "Non renseigné"}`
    );
  };

  return (
    <div className="flex flex-col tablet:flex-row gap-8 p-6">
      {/* Partie gauche : Informations sur la carte cadeau */}
      <div className="flex-1 border rounded-lg p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4">Carte cadeau</h1>

        {giftCard.description && (
          <p className="text-lg mb-2">
            <span className="font-semibold">Description :</span>{" "}
            {giftCard.description}
          </p>
        )}

        {!watch("hidePrice") && (
          <p className="text-lg mb-2">
            <span className="font-semibold">Valeur :</span>{" "}
            {`${giftCard.value} €`}
          </p>
        )}

        <p className="text-lg mb-2">
          <span className="font-semibold">Pour :</span>{" "}
          {watch("beneficiary") || "Non renseigné"}
        </p>

        {watch("comment") && (
          <p className="text-lg mb-2">
            <span className="font-semibold">Commentaire :</span>{" "}
            {watch("comment")}
          </p>
        )}

        <p className="text-lg mb-2">
          <span className="font-semibold">ID :</span> {giftCard._id}
        </p>
      </div>

      {/* Partie droite : Formulaire */}
      <div className="flex-1 border rounded-lg p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Informations</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Champ Bénéficiaire */}
          <div>
            <label
              htmlFor="beneficiary"
              className="block text-lg font-semibold mb-2"
            >
              Bénéficiaire
            </label>
            <input
              id="beneficiary"
              type="text"
              {...register("beneficiary", { required: true })}
              placeholder="Nom du bénéficiaire"
              className={`border rounded-lg w-full p-2 text-lg ${
                errors.beneficiary ? "border-red" : ""
              }`}
            />
          </div>

          {/* Champ Email du Bénéficiaire */}
          <div>
            <label
              htmlFor="beneficiaryEmail"
              className="block text-lg font-semibold mb-2"
            >
              Adresse email du bénéficiaire
            </label>
            <input
              id="beneficiaryEmail"
              type="email"
              {...register("beneficiaryEmail", { required: true })}
              placeholder="Email du bénéficiaire"
              className={`border rounded-lg w-full p-2 text-lg ${
                errors.beneficiaryEmail ? "border-red" : ""
              }`}
            />
          </div>

          {/* Champ Commentaire */}
          <div>
            <label
              htmlFor="comment"
              className="block text-lg font-semibold mb-2"
            >
              Ajouter un commentaire sur la carte
            </label>
            <input
              id="comment"
              type="text"
              {...register("comment")}
              placeholder="Votre commentaire"
              className="border rounded-lg w-full p-2 text-lg"
            />
          </div>

          {/* Checkbox Masquer le prix */}
          <div className="flex items-center gap-2">
            <input
              id="hidePrice"
              type="checkbox"
              {...register("hidePrice")}
              className="w-5 h-5"
            />
            <label htmlFor="hidePrice" className="text-lg">
              Masquer le prix lors de l'envoi du bon cadeau
            </label>
          </div>

          {/* Checkbox Recevoir une copie */}
          <div className="flex items-center gap-2">
            <input
              id="sendCopy"
              type="checkbox"
              {...register("sendCopy")}
              className="w-5 h-5"
            />
            <label htmlFor="sendCopy" className="text-lg">
              Recevoir une copie du mail
            </label>
          </div>

          {/* Champ Votre email (affiché si la checkbox est cochée) */}
          {watchSendCopy && (
            <div>
              <label
                htmlFor="yourEmail"
                className="block text-lg font-semibold mb-2"
              >
                Votre adresse email
              </label>
              <input
                id="yourEmail"
                type="email"
                {...register("yourEmail", { required: true })}
                placeholder="Votre adresse email"
                className={`border rounded-lg w-full p-2 text-lg ${
                  errors.yourEmail ? "border-red" : ""
                }`}
              />
            </div>
          )}

          {/* Bouton Valider */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-extraWhite text-lg bg-grey hover:bg-grey-dark"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}
