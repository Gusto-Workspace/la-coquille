import { useEffect, useRef } from "react";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan)
      );
    }
  };
}

export default function HeroSectionHomeComponent(props) {
  const heroRef = useRef(null);
  const bgBlackRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const bgBlackElement = bgBlackRef.current;
      const heroElement = heroRef.current;
      const logoElement = logoRef.current;

      gsap.set(bgBlackElement, { willChange: "transform" });

      const animation = gsap.timeline({
        scrollTrigger: {
          trigger: heroElement,
          start: "top top",
          end: "+=200vh",
          scrub: 1,
          pin: true,
          pinSpacing: false,
          onUpdate: throttle((self) => {
            props.setIsNavVisible(self.progress >= 1);
          }, 500),
        },
      });

      animation.to(
        bgBlackElement,
        {
          scale: 3.5,
          ease: "power2.out",
        },
        0
      );

      animation.to(
        logoElement,
        {
          scale: 1,
          ease: "none",
        },
        0
      );

      return () => {
        animation.scrollTrigger.kill();
      };
    }
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center "
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/img/restaurant-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
        }}
      />

      <div
        ref={bgBlackRef}
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/img/assets/bg-black.png')",
          backgroundSize: "cover",
          transform: "scale(1.3)",
          transition: "transform 0.1s linear",
        }}
      />

      <div className="absolute z-10">
        <div className="flex flex-col gap-2 text-white text-center">
          <img
            ref={logoRef}
            src="/img/logo-blanc.png"
            draggable={false}
            alt="logo"
            className="w-[280px] desktop:w-[350px] scale-90"
          />
        </div>
      </div>
    </div>
  );
}
