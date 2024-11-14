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
      className={`fixed top-0 flex justify-between items-center w-full bg-white drop-shadow-md py-2 px-12 z-10 transition-transform duration-500 ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      <div>
        <Link href="/">
          <img
            src="/img/logo-noir.png"
            draggable={false}
            alt="logo"
            className="max-h-[40px]"
          />
        </Link>
      </div>

      <ul className="flex gap-8 text-black uppercase text-sm">
        {navItemsData.map((item) => {
          const active = isActive(item.href);

          return (
            <li
              key={item.href}
              className={`${router.pathname === "/" || active ? "opacity-100" : "opacity-70"}`}
            >
              <Link href={item.href}>{t(item.label)}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
