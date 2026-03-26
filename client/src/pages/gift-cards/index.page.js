import Head from "next/head";
import { useEffect } from "react";

// I18N
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import ListGiftCardsComponent from "@/components/gift-cards/list.gift-cards.component";

export default function GiftCardsPage(props) {
  const title = "La Coquille - Restaurant";
  const description =
    "La Coquille est un restaurant gastronomique à Concarneau en Bretagne dans le Finistère. Le restaurant est situé sur les quais en face de la Ville Close.";

  function safeJsonParse(v, fallback = null) {
    try {
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

    const prefix = restaurantId
      ? `gm_gift_checkout:${restaurantId}:`
      : "gm_gift_checkout:";

    const now = Date.now();
    const keepConfirmingMs = 2 * 60 * 1000;

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;

      const checkout = safeJsonParse(localStorage.getItem(key), null);

      const isConfirmingRecent =
        checkout?.state === "confirming" &&
        checkout?.createdAt &&
        now - checkout.createdAt < keepConfirmingMs;

      if (isConfirmingRecent) continue;

      keysToRemove.push(key);
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }, []);

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
          <BannerComponent
            title="gifts:titles.main"
            description="gifts:descriptions.main"
            imgUrl="gifts.webp"
          />
          <ListGiftCardsComponent />
          <FooterComponent />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "gifts"])),
    },
  };
}
