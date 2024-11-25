import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// I18N
import { useTranslation } from "next-i18next";

gsap.registerPlugin(ScrollTrigger);

export default function GalleryHomeComponent() {
  const { t } = useTranslation("index");

  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const topRowElement = topRowRef.current;
      const bottomRowElement = bottomRowRef.current;

      // Apply will-change at the start
      topRowElement.style.willChange = "transform";
      bottomRowElement.style.willChange = "transform";

      gsap.to(topRowElement, {
        x: 200,
        scrollTrigger: {
          trigger: topRowElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      gsap.to(bottomRowElement, {
        x: -200,
        scrollTrigger: {
          trigger: bottomRowElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      // Clean up
      return () => {
        topRowElement.style.willChange = "auto";
        bottomRowElement.style.willChange = "auto";
      };
    }
  }, []);

  return (
    <section className="bg-grey text-center py-12 desktop:py-24">
      <div className="overflow-hidden space-y-6">
        <div
          ref={topRowRef}
          className="flex justify-center gap-6 -ml-24 pr-24"
          style={{ width: "calc(100% + 200px)" }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <img
              key={`top-${i + 1}`}
              src={`/img/dishes/${i + 1}.jpg`}
              alt={`Dish ${i + 1}`}
              className="object-cover rounded-md w-[calc(100vw/2)] desktop:w-[calc(100vw/4)] aspect-square"
              draggable={false}
              loading="lazy"
            />
          ))}
        </div>

        <div
          ref={bottomRowRef}
          className="flex justify-center gap-6 -ml-24 pr-24"
          style={{ width: "calc(100% + 200px)" }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <img
              key={`bottom-${i + 7}`}
              src={`/img/dishes/${i + 7}.jpg`}
              alt={`Dish ${i + 7}`}
              className="object-cover rounded-md w-[calc(100vw/2)] desktop:w-[calc(100vw/4)] aspect-square"
              draggable={false}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
