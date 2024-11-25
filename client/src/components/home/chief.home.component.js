import Link from "next/link";

// I18N
import { useTranslation } from "next-i18next";

export default function ChiefHomeComponent() {
  const { t } = useTranslation("index");

  return (
    <section className="bg-white flex items-center justify-between py-24">
      <div className="flex flex-col-reverse desktop:flex-row items-center gap-12 desktop:gap-24 max-w-[80%] mx-auto">
        <div className="desktop:w-1/2 mx-auto">
          <img
            src="/img/chief.jpg"
            alt="Image des ingrédients"
            className="max-h-[500px] mx-auto rounded-md"
          />
        </div>

        <div className="text-center desktop:text-left desktop:w-1/2">
          <h3 className="text-sm tracking-wide opacity-70 uppercase">
            {t("chief.subtitle")}
          </h3>

          <div className="flex flex-col gap-6">
            <h2
              className="text-3xl desktop:text-4xl mt-4 font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Abel', sans-serif" }}
            >
              {t("chief.title")}
            </h2>

            <p
              className="max-w-[620px] mx-auto font-extralight opacity-70 text-lg"
              style={{ fontFamily: "'Abel', sans-serif" }}
            >
              {t("chief.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
