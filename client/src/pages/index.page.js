import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// I18N
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import HeroSectionHomeComponent from "@/components/home/hero-section.home.component";
import NavComponent from "@/components/_shared/nav/nav.component";
import StoryHomeComponent from "@/components/home/story.home.component";
import IngredientsHomeComponent from "@/components/home/ingredients.home.component";
import GalleryHomeComponent from "@/components/home/gallery.home.component";
import ChiefHomeComponent from "@/components/home/chief.home.component";
import NewsHomeComponent from "@/components/home/news.home.component";
import FooterComponent from "@/components/_shared/footer/footer.component";

export default function HomePage(props) {
  const title = "La Coquille - Restaurant";
  const description =
    "La Coquille est un restaurant gastronomique à Concarneau en Bretagne dans le Finistère. Le restaurant est situé sur les quais en face de la Ville Close.";

  const [isNavVisible, setIsNavVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hash = router.asPath.split("#")[1];
    if (hash === "news") {
      const newsSection = document.getElementById(hash);
      if (newsSection) {
        setTimeout(() => {
          newsSection.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, [router.asPath]);
  

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
        <NavComponent isVisible={isNavVisible} />

        <div>
          <HeroSectionHomeComponent setIsNavVisible={setIsNavVisible} />

          <StoryHomeComponent />

          <IngredientsHomeComponent />

          <GalleryHomeComponent />

          <ChiefHomeComponent />

          <NewsHomeComponent />

          <FooterComponent />
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
