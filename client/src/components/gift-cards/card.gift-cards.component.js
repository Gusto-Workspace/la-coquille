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

      <div className="my-12 grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-4 gap-6">
        {restaurantContext?.restaurantData?.giftCards
          ?.filter(props.filterCondition)
          ?.sort((a, b) => a.value - b.value)
          .map((giftCard, i) => (
            <div key={i} className="flex flex-col items-center gap-2 border">
              <div className="flex flex-col text-center gap-2 h-full">
                {giftCard.description && (
                  <p className="text-sm opacity-50">{giftCard.description}</p>
                )}

                <h2 className="text-xl">{giftCard.value} €</h2>
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
                Offrir
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
