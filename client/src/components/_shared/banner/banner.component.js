import { useEffect, useRef } from "react";

// I18N
import { useTranslation } from "next-i18next";

// GSAP
import { gsap } from "gsap";

export default function BannerContactComponent(props) {
  const { t } = useTranslation("");
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <div
      className="h-[30vw] flex flex-col justify-center text-center items-center gap-6 text-extraWhite"
      style={{
        backgroundImage: `url('/img/${props.imgUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1
        ref={titleRef}
        style={{
          fontFamily: "'Abel', sans-serif",
        }}
        className="text-6xl uppercase"
      >
        {t(props.title)}
      </h1>
      <p
        ref={descriptionRef}
        className="max-w-[620px] mx-auto font-extralight text-lg"
        style={{
          fontFamily: "'Abel', sans-serif",
        }}
      >
        {t(props.description)}
      </p>
    </div>
  );
}
