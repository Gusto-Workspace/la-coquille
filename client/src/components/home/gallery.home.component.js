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
    
      gsap.to(topRowRef.current, {
        x: 100, 
        scrollTrigger: {
          trigger: topRowRef.current,
          start: "top bottom",
          end: "bottom top", 
          scrub: 1, 
        },
      });

     
      gsap.to(bottomRowRef.current, {
        x: -100, 
        scrollTrigger: {
          trigger: bottomRowRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
  }, []);

  return (
    <section className="bg-grey text-center py-24">
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
              style={{ width: "calc(100vw / 4 )", aspectRatio: "1/1" }}
              className="object-cover rounded-md"
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
              style={{ width: "calc(100vw / 4 )", aspectRatio: "1/1" }}
              className="object-cover rounded-md"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
