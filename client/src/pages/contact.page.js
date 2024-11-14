import Head from "next/head";

// I18N
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";

export default function ContactPage(props) {
  let title;
  let description;

  switch (i18n.language) {
    case "en":
      title = "La Coquille - Restaurant";
      description =
        "La Coquille is a gourmet restaurant in Concarneau, Brittany, in the Finistère region. The restaurant is located on the quayside, opposite the Ville Close.";
      break;
    default:
      title = "La Coquille - Restaurant";
      description =
        "La Coquille est un restaurant gastronomique à Concarneau en Bretagne dans le Finistère. Le restaurant est situé sur les quais en face de la Ville Close.";
  }

  return (
    <>
      <Head>
        <title>{title}</title>

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

      <div className="relative">
        <NavComponent />

        <div className="mt-[62px]">
          <div className="my-12">test</div>
          <div className="my-12">test</div>
          <div className="my-12">test</div>
          <div className="my-12">test</div>
          <div className="my-12">test</div>
          <div className="my-12">test</div>
          <div className="my-12">test</div>
          <div className="my-12">test</div>
          <div className="my-12">test</div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contact"])),
    },
  };
}
