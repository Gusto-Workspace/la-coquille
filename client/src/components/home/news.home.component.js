import Link from "next/link";

// I18N
import { useTranslation } from "next-i18next";

export default function NewsHomeComponent() {
  const { t } = useTranslation("index");

  return (
    <section className="bg-extraWhite flex flex-col items-center py-24">
      <h3 className="text-sm tracking-wide opacity-70 uppercase">
        {t("news.subtitle")}
      </h3>

      <div className="flex flex-col gap-6 items-center max-w-[80%] mx-auto">
        <h2
          className="text-4xl mt-4 font-bold tracking-widest uppercase"
          style={{ fontFamily: "'Abel', sans-serif" }}
        >
          {t("news.title")}
        </h2>

        <p
          className="text-center max-w-[620px] mx-auto font-extralight opacity-70 text-lg"
          style={{ fontFamily: "'Abel', sans-serif" }}
        >
          {t("news.description")}
        </p>
      </div>
    </section>
  );
}
