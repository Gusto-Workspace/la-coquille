// pages/_app.js
import "@/styles/style.scss";
import "@/styles/tailwind.css";
import "@/styles/custom/_index.scss";

import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import axios from "axios";
import { appWithTranslation } from "next-i18next";
import { GlobalProvider } from "@/contexts/global.context";

function TrackVisits() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  const hasLoggedFirst = useRef(false);
  const prevPath = useRef("");

  useEffect(() => {
    if (!router.isReady) return;

    const logVisit = () => {
      if (!RESTAURANT_ID) return;
      axios
        .post(`${API_URL}/restaurants/${RESTAURANT_ID}/visits`)
        .catch((e) => console.error("log visite :", e));
    };

    if (!hasLoggedFirst.current) {
      logVisit();
      hasLoggedFirst.current = true;
      prevPath.current = router.asPath;
      return;
    }

    if (prevPath.current !== router.asPath) {
      logVisit();
      prevPath.current = router.asPath;
    }
  }, [router.isReady, router.asPath, API_URL, RESTAURANT_ID]);

  return null;
}

function App({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <TrackVisits />
      <Component {...pageProps} />
    </GlobalProvider>
  );
}

export default appWithTranslation(App);
