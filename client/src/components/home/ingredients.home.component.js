// I18N
import { useTranslation } from "next-i18next";

export default function IngredientsHomeComponent() {
  const { t } = useTranslation("index");

  return (
    <section className="flex items-center justify-between py-24">
      <div className="flex items-center gap-24 max-w-[80%] mx-auto">
        <div className="text-left w-1/2">
          <h3 className="text-sm tracking-wide opacity-70 uppercase">
            {t("ingredients.subtitle")}
          </h3>

          <h2
            className="text-4xl mt-4 mb-6 font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Abel', sans-serif" }}
          >
            {t("ingredients.title")}
          </h2>

          <p
            className="max-w-[620px] mx-auto font-extralight opacity-70 text-lg"
            style={{ fontFamily: "'Abel', sans-serif" }}
          >
            {t("ingredients.description")}
          </p>
          <button
            style={{ fontFamily: "'Abel', sans-serif" }}
            className="font-bold mt-8 px-6 py-3 bg-white text-darkBrown"
          >
            {t("ingredients.buttons.seeMenu")}
          </button>
        </div>

        <div className="w-1/2">
          <img
            src="/img/ingredients.jpg"
            alt="Image des ingrédients"
            className="max-h-[300px]"
          />
        </div>
      </div>
    </section>
  );
}
