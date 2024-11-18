// I18N
import { useTranslation } from "next-i18next";

export default function BannerContactComponent() {
  const { t } = useTranslation("contact");

  return (
    <div
      className="h-[25vw] flex flex-col justify-center text-center items-center gap-6 text-extraWhite"
      style={{
        backgroundImage: "url('/img/contact.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "'Abel', sans-serif",
        }}
        className="text-6xl uppercase"
      >
        {t("titles.main")}
      </h1>
      <p
        className="max-w-[620px] mx-auto font-extralight text-lg"
        style={{ fontFamily: "'Abel', sans-serif" }}
      >
        {t("description")}
      </p>
    </div>
  );
}
