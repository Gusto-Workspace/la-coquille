import { useContext, useEffect, useRef, useState } from "react";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// I18N
import { useTranslation } from "next-i18next";

// SVG
import { ChevronSvg } from "../_shared/_svgs/chevron.svg";

export default function NewsHomeComponent() {
  const { t } = useTranslation("index");
  const { restaurantContext } = useContext(GlobalContext);

  const scrollContainerRef = useRef(null);
  const [scrollWidthPercentage, setScrollWidthPercentage] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  }

  useEffect(() => {
    const updateCardWidth = () => {
      if (scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const calculatedWidth = (containerWidth - 64) / 3;
        setCardWidth(calculatedWidth);
      }
    };

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const scrollPercentage = (scrollLeft / maxScrollLeft) * 100;
      setScrollWidthPercentage(scrollPercentage || 0);
    };

    const observer = new ResizeObserver(updateCardWidth);
    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    updateCardWidth();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = cardWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-extraWhite flex flex-col gap-12 py-24">
      <div className="flex flex-col items-center">
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
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-8 mx-auto overflow-x-auto scroll-smooth px-[10%] custom-scrollbar"
      >
        {restaurantContext?.restaurantData?.news
          ?.filter((data) => data.visible)
          .map((data, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col gap-4"
              style={{
                width: `calc((100% - 64px) / 3)`,
                fontFamily: "'Abel', sans-serif",
              }}
            >
              <div
                className="h-[280px] bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `url(${data.image})`,
                }}
              />
              <p className="uppercase opacity-30 tracking-wider text-sm">
                {formatDate(data.published_at)}
              </p>

              <h2 className="text-xl uppercase">{data.title}</h2>

              <p
                className="opacity-50"
                dangerouslySetInnerHTML={{
                  __html: data.description,
                }}
              />
            </div>
          ))}
      </div>

      <div className="relative w-full flex justify-center items-center">
        <div className="relative h-1 w-[80%] bg-white rounded-full">
          <div
            className="absolute w-0 h-full bg-grey opacity-50 rounded-full"
            style={{ width: `${scrollWidthPercentage}%` }}
          />
        </div>

        <button
          onClick={() => handleScroll("left")}
          className="absolute left-[3%] z-10 bg-grey/80 hover:bg-grey text-white rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Scroll Left"
        >
          <ChevronSvg strokeColor='#FFFFFF' className="-ml-[2px] rotate-90" />
        </button>

        <button
          onClick={() => handleScroll("right")}
          className="absolute right-[3%] z-10 bg-grey/80 hover:bg-grey text-white rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Scroll Right"
        >
          <ChevronSvg strokeColor='#FFFFFF' className="ml-[2px] -rotate-90" />
        </button>
      </div>
    </section>
  );
}
