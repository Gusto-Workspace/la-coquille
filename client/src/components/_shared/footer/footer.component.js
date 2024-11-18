import Link from "next/link";
import { useContext } from "react";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// ICONS
import * as icons from "@/components/_shared/_svgs/_index";

// I18N
import { useTranslation } from "next-i18next";

// DATA
import { footerItemsData } from "@/_assets/data/footer-items.data";
import { navItemsData } from "@/_assets/data/nav-items.data";

export default function FooterComponent() {
  const { t } = useTranslation("");
  const { restaurantContext } = useContext(GlobalContext);

  return (
    <footer className="bg-grey pt-12 pb-8">
      <div className="max-w-[90%] mx-auto flex flex-col gap-8">
        <div className="flex justify-between">
          <Link href="/">
            <img
              src="/img/logo-blanc.png"
              draggable={false}
              alt="logo"
              className="max-h-[50px]"
            />
          </Link>

          <div className="flex gap-4">
            {footerItemsData.map((item) => {
              const IconComponent = icons[item.icon];
              const socialLink =
                restaurantContext?.restaurantData?.social_media?.[item.field];

              if (socialLink) {
                return (
                  <Link
                    key={item.field}
                    href={socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent
                      width={36}
                      height={36}
                      strokeColor="#FFFFFF"
                      fillColor="#FFFFFF"
                    />
                  </Link>
                );
              }

              return null;
            })}
          </div>
        </div>

        <div className="flex flex-col items-center justify-evenly gap-12">
          <ul className="flex gap-6 items-center text-extraWhite uppercase text-sm mx-auto">
            {navItemsData.map((item) => {
              return (
                <li
                  key={item.href}
                  className="font-bold text-base"
                  style={{ fontFamily: "'Abel', sans-serif" }}
                >
                  <Link href={item.href}>{t(`common:${item.label}`)}</Link>
                </li>
              );
            })}
          </ul>

          <div
            style={{ fontFamily: "'Abel', sans-serif" }}
            className="flex flex-col items-center gap-2 text-extraWhite"
          >
            <p>{restaurantContext?.restaurantData?.phone}</p>

            <p>
              <a href={`mailto:${restaurantContext?.restaurantData?.email}`}>
                {restaurantContext?.restaurantData?.email}
              </a>
            </p>

            <div className="flex gap-1">
              <p>{restaurantContext?.restaurantData?.address?.line1},</p>

              <p>{restaurantContext?.restaurantData?.address?.city}</p>
            </div>
          </div>
        </div>

        <hr className="h-[2px] w-full bg-extraWhite opacity-30" />

        <div className="flex justify-between text-sm text-extraWhite opacity-30">
          <div className="flex gap-4">
            <Link href="/policy">Politique de confidentialité</Link>•
            <Link href="/legales">Mentions légales</Link>
          </div>

          <p>© 2023 WebDev, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
