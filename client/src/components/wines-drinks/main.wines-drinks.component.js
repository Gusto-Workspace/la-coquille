import { useState, useRef, useEffect } from "react";

// I18N
import { useTranslation } from "next-i18next";

// COMPONENTS
import ListDrinksComponent from "./list-drinks.component";
import ListWinesComponent from "./list-wines.component";

export default function MainWinesDrinksComponent() {
  const { t } = useTranslation("drinks");
  const [activeTab, setActiveTab] = useState("wines");
  const [hoverTab, setHoverTab] = useState(null);
  const winesRef = useRef(null);
  const drinksRef = useRef(null);
  const [underlinePosition, setUnderlinePosition] = useState({
    width: 0,
    left: 0,
  });
  const [isReady, setIsReady] = useState(false); // To control when to show the underline

  const updateUnderlinePosition = () => {
    const ref =
      hoverTab === "wines"
        ? winesRef
        : hoverTab === "drinks"
          ? drinksRef
          : activeTab === "wines"
            ? winesRef
            : drinksRef;

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setUnderlinePosition({
        width: rect.width,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    updateUnderlinePosition();
    setIsReady(true); // Set to true after initial calculation
  }, [activeTab, hoverTab]);

  useEffect(() => {
    window.addEventListener("resize", updateUnderlinePosition);
    return () => {
      window.removeEventListener("resize", updateUnderlinePosition);
    };
  }, []);

  useEffect(() => {
    updateUnderlinePosition();
    setIsReady(true);
  }, []);

  return (
    <section
      className="pt-24"
      style={{
        fontFamily: "'Abel', sans-serif",
      }}
    >
      <div className="relative flex justify-center gap-24 items-center mb-4">
        {isReady && (
          <div
            className="absolute h-[2px] rounded-full bg-grey transition-all duration-300"
            style={{
              width: `${underlinePosition.width}px`,
              left: `${underlinePosition.left}px`,
              bottom: "0%",
            }}
          />
        )}

        <button
          ref={winesRef}
          onClick={() => setActiveTab("wines")}
          onMouseEnter={() => setHoverTab("wines")}
          onMouseLeave={() => setHoverTab(null)}
          className={`px-6 py-2 text-3xl font-semibold uppercase text-center transition-opacity duration-300 ${
            activeTab === "wines" ? "" : " opacity-30"
          }`}
        >
          {t("wines.title")}
        </button>

        <button
          ref={drinksRef}
          onClick={() => setActiveTab("drinks")}
          onMouseEnter={() => setHoverTab("drinks")}
          onMouseLeave={() => setHoverTab(null)}
          className={`px-6 py-2 text-3xl font-semibold uppercase text-center transition-opacity duration-300 ${
            activeTab === "drinks" ? "" : " opacity-30"
          }`}
        >
          {t("drinks.title")}
        </button>
      </div>

      <div className="max-w-[80%] mx-auto">
        {activeTab === "wines" && <ListWinesComponent />}
        {activeTab === "drinks" && <ListDrinksComponent />}
      </div>

      {activeTab === "wines" && (
        <img
          className="max-w-[50%] mx-auto"
          src="/img/wine-1.jpeg"
          draggable={false}
          alt="wine"
        />
      )}

      {activeTab === "drinks" && (
        <img
          className="max-w-[60%] mx-auto mt-16"
          src="/img/drinks-1.webp"
          draggable={false}
          alt="wine"
        />
      )}
    </section>
  );
}
