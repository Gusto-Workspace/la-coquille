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

      // Animate the mask size
      animation.to(maskElement, {
        ease: "power1.out",
        WebkitMaskImage: "radial-gradient(circle, black 100%, transparent 100%)",
        maskImage: "radial-gradient(circle, black 100%, transparent 100%)",
        onUpdate: () => {
          // Force browser optimization for Safari
          maskElement.style.willChange = "transform, opacity";
        },
        onComplete: () => {
          // Reset will-change for better performance after animation
          maskElement.style.willChange = "auto";
        },
      });

      // Animate the logo scaling
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
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/img/restaurant-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          WebkitMaskImage:
            "radial-gradient(circle, black 40%, transparent 40%)",
          maskImage: "radial-gradient(circle, black 40%, transparent 40%)",
          transition: "transform 0.1s linear", // Smooth updates
        }}
      />

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
