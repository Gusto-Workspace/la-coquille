import Link from "next/link";
import { useRouter } from "next/router";

// I18N
import { useTranslation } from "next-i18next";

// DATA
import { navItemsData } from "@/_assets/data/_index.data";

export default function NavComponent({ isVisible = true }) {
  const { t } = useTranslation("common");
  const router = useRouter();

  function isActive(itemHref) {
    if (router.pathname === "/") {
      return true;
    }
    return router.pathname.startsWith(itemHref) && router.pathname !== "/";
  }

  return (
    <nav
      className={`z-20 fixed top-0 flex justify-between items-center w-full bg-extraWhite drop-shadow-md py-4 px-12 transition-transform duration-500 ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      <div>
        <Link href="/">
          <img
            src="/img/logo-noir.png"
            draggable={false}
            alt="logo"
            className="max-h-[30px]"
          />
        </Link>
      </div>

      <ul className="flex items-center gap-8 text-black uppercase text-sm">
        {navItemsData.map((item) => {
          const active = isActive(item.href);

          return (
            <li
              key={item.href}
              className={`relative text-base ${router.pathname === "/" || active ? "opacity-100" : "opacity-70"}`}
              style={{ fontFamily: "'Abel', sans-serif" }}
            >
              <Link href={item.href}>{t(item.label)}</Link>
              <span
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-black ${active && router.pathname !== "/" ? "block" : "hidden"}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
