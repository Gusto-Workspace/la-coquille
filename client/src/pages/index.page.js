import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// I18N
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS

export default function HomePage(props) {
  let title;
  let description;

  switch (i18n.language) {
    case "en":
      title = "La Coquille - Restaurant";
      description = "";
      break;
    default:
      title = "La Coquille - Restaurant";
      description = "";
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Abel&display=swap"
          rel="stylesheet"
        />

        <>
          {description && <meta name="description" content={description} />}
          {title && <meta property="og:title" content={title} />}
          {description && (
            <meta property="og:description" content={description} />
          )}
          <meta
            property="og:url"
            content="https://www.lacoquille-concarneau.fr/"
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/img/1.jpg" />
          <meta property="og:image:width" content="1920" />
          <meta property="og:image:height" content="1080" />
        </>
      </Head>
      <div>
        <div
          className="relative h-screen flex bg-black bg-opacity-95  items-center justify-center gap-12 p-4"
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
            className="absolute top-8 left-[6vw]"
          />

          <div className="w-1/3 pl-[6vw] pr-12 flex flex-col gap-8">
            <div className=" text-white flex flex-col">
              <h1
                className="text-[5vw] leading-[4.5vw] max-w-[280px]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Site en maintenance
              </h1>
            </div>

            <div className="text-white text-xl">
              <p style={{ fontFamily: "'Abel', sans-serif" }}>
                Merci de nous contacter par mail
              </p>

              <p
                className="italic text-base"
                style={{ fontFamily: "'Abel', sans-serif" }}
              >
                restaurant-la-coquille@orange.fr
              </p>
            </div>

            <div className="text-white text-xl">
              <p style={{ fontFamily: "'Abel', sans-serif" }}>Adresse</p>

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
            className="rounded-xl w-2/3 h-full"
          />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "index"])),
    },
  };
}
