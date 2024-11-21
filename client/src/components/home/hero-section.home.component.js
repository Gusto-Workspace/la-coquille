import { useEffect, useRef } from "react";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSectionHomeComponent(props) {
  const heroRef = useRef(null);
  const maskRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const maskElement = maskRef.current;
      const heroElement = heroRef.current;
      const logoElement = logoRef.current;

      const animation = gsap.timeline({
        scrollTrigger: {
          trigger: heroElement,
          start: "top top",
          end: "+=100vh",
          scrub: true,
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            props.setIsNavVisible(self.progress >= 1);
          },
        },
      });

      animation.to(maskElement, {
        ease: "power1.out",
        clipPath: "circle(75% at center)",

        onStart: () => {
          maskElement.style["transform"] = "translateZ(0)";
          maskElement.style["backface-visibility"] = "hidden";
        },
      });

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
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#070303]"
    >
      <div
        ref={maskRef}
        className="absolute inset-0 bg-black"
        style={{
          clipPath: "circle(30% at center)",
          // transition: "clip-path 0.2s linear",
        }}
      >
        <div
          style={{
            backgroundImage: "url('/img/restaurant-1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <div className="absolute z-10">
        <div className="flex flex-col gap-2 text-white text-center">
          <img
            ref={logoRef}
            src="/img/logo-blanc.png"
            draggable={false}
            alt="logo"
            className="w-[350px] scale-90"
          />
        </div>
      </div>
    </div>
  );
}
