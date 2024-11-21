import { useEffect, useRef } from "react";

// I18N
import { useTranslation } from "next-i18next";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BannerComponent(props) {
  const { t } = useTranslation("");
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const bannerRef = useRef(null);
  const bgImageRef = useRef(null);

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

      gsap.to(bgImageRef.current, {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top-=62px top",
          end: "bottom top",
          scrub: 0.3,
        },
      });
    }
  }, []);

  return (
    <div
      ref={bannerRef}
      className="h-[30vw] flex flex-col justify-center text-center items-center gap-6 text-extraWhite relative overflow-hidden"
      style={{
        willChange: "transform",
      }}
    >
      <div
        ref={bgImageRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/img/${props.imgUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateY(0%)",
          willChange: "transform",
        }}
      />

      {props.opacity && (
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none" />
      )}

      <h1
        ref={titleRef}
        style={{
          fontFamily: "'Abel', sans-serif",
        }}
        className="text-6xl uppercase z-10"
      >
        {t(props.title)}
      </h1>
      <p
        ref={descriptionRef}
        className="max-w-[620px] mx-auto font-extralight text-lg z-10"
        style={{
          fontFamily: "'Abel', sans-serif",
        }}
      >
        {t(props.description)}
      </p>
    </div>
  );
}
