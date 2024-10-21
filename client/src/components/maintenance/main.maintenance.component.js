// I18N
import { useTranslation } from "next-i18next";

export default function MainMaintenanceComponent() {
  const { t } = useTranslation("maintenance");
  return (
    <section
      className="relative h-screen flex desktop:flex-row flex-col bg-black bg-opacity-95  items-center justify-center gap-12 p-4"
      style={{
        backgroundImage: 'url("/img/image.png")',
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src="/img/00.png"
        alt="Maintenance Icon"
        className="desktop:absolute top-8 left-[6vw]"
      />

      <div className="text-center desktop:text-left desktop:w-1/3 desktop:pl-[6vw] desktop:pr-12 flex flex-col gap-8">
        <div className=" text-white flex flex-col">
          <h1
            className="text-5xl desktop:text-[5vw] desktop:leading-[4.5vw] desktop:max-w-[280px]"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
           {t('title')}
          </h1>
        </div>

        <div className="text-white text-xl">
          <p style={{ fontFamily: "'Abel', sans-serif" }}>
            {t('contact')}
          </p>

          <p
            className="italic text-base"
            style={{ fontFamily: "'Abel', sans-serif" }}
          >
            restaurant-la-coquille@orange.fr
          </p>
        </div>

        <div className="text-white text-xl">
          <p style={{ fontFamily: "'Abel', sans-serif" }}>{t('address')}</p>

          <p
            className=" text-base"
            style={{ fontFamily: "'Abel', sans-serif" }}
          >
            Rue du Moros, 29900 Concarneau
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundImage: 'url("/img/1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="rounded-xl w-full desktop:w-2/3 h-full"
      />
    </section>
  );
}
