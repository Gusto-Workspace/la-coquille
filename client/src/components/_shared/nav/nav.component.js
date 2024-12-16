import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

// I18N
import { useTranslation } from "next-i18next";

// DATA
import { navItemsData } from "@/_assets/data/_index.data";

export default function NavComponent({ isVisible = true }) {
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  function isActive(itemHref) {
    if (router.pathname === "/") {
      return true;
    }
    return router.pathname.startsWith(itemHref) && router.pathname !== "/";
  }

  const handleScrollToNews = (e) => {
    e.preventDefault();

    if (router.pathname !== "/") {
      router.push("/#news");
    } else {
      const newsSection = document.getElementById("news");
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
      }
    }
  };

  return (
    <>
      <div
        className={`fixed w-full h-full inset-0 flex justify-center items-center ${
          menuOpen
            ? "bg-black bg-opacity-20 backdrop-blur-sm"
            : "pointer-events-none"
        } transition-bg duration-200 ease-in-out z-20`}
        onClick={() => setMenuOpen(false)}
      />

      <nav
        className={`z-20 fixed top-0 flex justify-between items-center w-full bg-extraWhite drop-shadow-md py-4 desktop:px-12 transition-all duration-500 ${
          isVisible ? "transform translate-y-0" : "transform -translate-y-full"
        }`}
      >
        <div className="h-[62px] w-full bg-extraWhite absolute desktop:hidden" />

        <div className="z-10">
          <Link href="/">
            <img
              src="/img/logo-noir.png"
              draggable={false}
              alt="logo"
              className="max-h-[30px] px-4 desktop:px-0 z-40"
            />
          </Link>
        </div>

        <button
          className={`fixed top-5 right-4 z-40 desktop:hidden`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            className={`h-0.5 w-8 bg-grey transform transition duration-500 ease-in-out ${
              menuOpen ? "rotate-45 translate-y-2.5" : ""
            }`}
          />
          <div className="my-2">
            <div
              className={`h-0.5 w-8 bg-grey transition-all duration-500 ease-in-out  ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          <div
            className={`h-0.5 w-8 bg-grey transform transition duration-500 ease-in-out ${
              menuOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          />
        </button>

        <ul
          className={`bg-extraWhite absolute top-[62px] -z-10 right-0 left-0 py-8 ${
            !menuOpen ? "-translate-y-[150%]" : "translate-y-0"
          } transition-all duration-500 rounded-b-md desktop:translate-y-0 desktop:py-0 desktop:top-0 flex flex-col desktop:relative desktop:flex-row items-center gap-8 text-black uppercase text-sm`}
        >
          {navItemsData.map((item) => {
            const active = isActive(item.href);

            // Si l'élément est "news", ajouter la gestion du scroll
            if (item.label === "nav.news") {
              return (
                <li
                  key={item.href}
                  className={`relative text-lg desktop:text-base ${
                    router.pathname === "/" ? "opacity-100" : "opacity-70"
                  }`}
                  style={{ fontFamily: "'Abel', sans-serif" }}
                >
                  <a href="#news" onClick={handleScrollToNews}>
                    {t(item.label)}
                  </a>
                </li>
              );
            }

            return (
              <li
                key={item.href}
                className={`relative text-lg desktop:text-base ${
                  router.pathname === "/" || active
                    ? "opacity-100"
                    : "opacity-70"
                }`}
                style={{ fontFamily: "'Abel', sans-serif" }}
              >
                <Link href={item.href}>{t(item.label)}</Link>
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-black ${
                    active && router.pathname !== "/" ? "block" : "hidden"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
