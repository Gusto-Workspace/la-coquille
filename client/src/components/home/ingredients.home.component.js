import Link from "next/link";

// I18N
import { useTranslation } from "next-i18next";

export default function IngredientsHomeComponent() {
  const { t } = useTranslation("index");

  return (
    <section className="flex items-center justify-between py-24">
      <div className="flex flex-col desktop:flex-row items-center gap-12 desktop:gap-24 max-w-[80%] mx-auto">
        <div className="text-center desktop:text-left w-full desktop:w-1/2">
          <h3 className="text-sm tracking-wide opacity-70 uppercase">
            {t("ingredients.subtitle")}
          </h3>

          <div className="flex flex-col gap-6">
            <h2
              className="text-3xl desktop:text-4xl mt-4 font-bold tracking-widest uppercase"
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
            
            <div className="flex gap-2 justify-center desktop:justify-start">
              <Link
                href="/dishes"
                style={{ fontFamily: "'Abel', sans-serif" }}
                className="w-fit rounded-md px-6 py-3 bg-white text-darkBrown"
              >
                {t("ingredients.buttons.seeDishes")}
              </Link>

              <Link
                href="/menus"
                style={{ fontFamily: "'Abel', sans-serif" }}
                className="w-fit rounded-md px-6 py-3 bg-white text-darkBrown"
              >
                {t("ingredients.buttons.seeMenus")}
              </Link>
            </div>
          </div>
        </div>

        <div className="desktop:w-1/2">
          <img
            src="/img/ingredient.jpg"
            alt="lobster"
            className="desktop:max-h-[300px]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
