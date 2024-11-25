import { useRouter } from "next/router";
import { useContext } from "react";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// I18N
import { useTranslation } from "next-i18next";

export default function CardGiftCardsComponent(props) {
  const { t } = useTranslation("gifts");
  const { restaurantContext } = useContext(GlobalContext);

  const router = useRouter();

  return (
    <div
      style={{
        fontFamily: "'Abel', sans-serif",
      }}
    >
      <div className="flex flex-col gap-4">
        <h2 className="relative text-3xl font-semibold uppercase text-center bg-extraWhite px-6 w-fit mx-auto">
          {t(props.title)}
        </h2>

        <p className="max-w-[620px] mx-auto font-extralight opacity-70 text-lg text-center text-balance">
          {t(props.description)}
        </p>
      </div>

      <div className="my-12 grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3  gap-6">
        {restaurantContext?.restaurantData?.giftCards
          ?.filter(props.filterCondition)
          ?.sort((a, b) => a.value - b.value)
          .map((giftCard, i) => (
            <div key={i} className="flex flex-col items-center gap-6 p-2">
              <div
                className="flex flex-col items-end gap-2 h-full border aspect-[16/9] w-[100%] bg-center bg-cover bg-no-repeat shadow-xl drop-shadow-xl"
                style={{ backgroundImage: "url(/img/assets/bg-gift-card.png" }}
              >
                <div className="w-2/3 flex flex-col gap-2 items-center justify-center h-full my-auto">
                  <h1 className="text-2xl desktop:text-[2vw] font-bold">Carte cadeau</h1>

                  <div className="flex flex-col items-center">
                    <h2 className="text-xl desktop:text-[1.5vw]">{giftCard.value} €</h2>

                    {giftCard.description && (
                      <p className="text-sm desktop:text-[1vw] text-center px-4">{giftCard.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  router.push({
                    pathname: "/gift-cards/buy",
                    query: {
                      id: giftCard._id,
                    },
                  })
                }
                className="bg-grey text-extraWhite px-6 py-2 w-fit rounded-md"
              >
                Sélectionner cette carte
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
