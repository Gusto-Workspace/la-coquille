import Link from "next/link";
import { useState, useContext } from "react";

// I18N
import { useTranslation } from "next-i18next";

// DATA
import { footerItemsData } from "@/_assets/data/footer-items.data";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// ICONS
import * as icons from "@/components/_shared/_svgs/_index";

// REACT HOOK FORM
import { useForm } from "react-hook-form";

export default function FormContactCompnent() {
  const { t } = useTranslation("contact");
  const { restaurantContext } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact-form-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        console.error("Réponse du serveur: erreur", response);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col gap-12 desktop:flex-row justify-center  py-24 max-w-[80%] mx-auto">
      <div className="flex justify-center flex-col w-full desktop:w-1/2 gap-6 desktop:gap-12">
        <div
          style={{
            fontFamily: "'Abel', sans-serif",
          }}
        >
          <h3 className="text-xl">Horaires d'ouverture</h3>
          
          <ul className="mt-4 opacity-50">
            {restaurantContext?.restaurantData?.opening_hours.map(
              (day, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <span>{t(day.day)}</span>

                  <span>
                    {day.isClosed
                      ? t("hours.close")
                      : day.hours.length > 0
                        ? `${day.hours[0].open} - ${day.hours[0].close}`
                        : t("hours.noHours")}{" "}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
        <div
          className="flex flex-col gap-6"
          style={{
            fontFamily: "'Abel', sans-serif",
          }}
        >
          <div className="flex items-center flex-row gap-2">
            <icons.EmailSvg
              width={28}
              height={28}
              fillColor="#3F3A35"
              strokeColor="#3F3A36"
            />
            <p className="font-thin opacity-50">
              {restaurantContext?.restaurantData?.email}
            </p>
          </div>

          <div className="flex items-center flex-row gap-2">
            <icons.PhoneSvg
              width={28}
              height={28}
              fillColor="#3F3A35"
              strokeColor="#3F3A36"
            />
            <p className="font-thin opacity-50">
              {restaurantContext?.restaurantData?.phone}
            </p>
          </div>

          <div className="flex items-center flex-row gap-2">
            <icons.RestaurantSvg
              width={28}
              height={28}
              fillColor="#3F3A35"
              strokeColor="#3F3A36"
            />

            <div>
              <p
                className="font-thin opacity-50"
                style={{
                  fontFamily: "'Abel', sans-serif",
                }}
              >
                {restaurantContext?.restaurantData?.address?.line1}
              </p>
              <p
                className="font-thin opacity-50"
                style={{
                  fontFamily: "'Abel', sans-serif",
                }}
              >
                {restaurantContext?.restaurantData?.address?.zipCode},{" "}
                {restaurantContext?.restaurantData?.address?.city}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mx-auto desktop:mx-0">
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
                    strokeColor="#3F3A36"
                    fillColor="#3F3A36"
                  />
                </Link>
              );
            }

            return null;
          })}
        </div>
      </div>

      <div className="w-full desktop:w-1/2 flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <input
            {...register("name", { required: true })}
            placeholder={t("form.labels.name")}
            className={`p-3 rounded-md ${
              errors.name ? "border-red border" : "border-grey border"
            }`}
            style={{
              fontFamily: "'Abel', sans-serif",
            }}
          />

          <input
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            })}
            placeholder={t("form.labels.email")}
            className={`p-3 rounded-md ${
              errors.email ? "border-red border" : "border-grey border"
            }`}
            style={{
              fontFamily: "'Abel', sans-serif",
            }}
          />

          <input
            {...register("phone", { required: true })}
            placeholder={t("form.labels.phone")}
            className={`p-3 rounded-md ${
              errors.phone ? "border-red border" : "border-grey border"
            }`}
            style={{
              fontFamily: "'Abel', sans-serif",
            }}
          />

          <textarea
            {...register("message", { required: true })}
            placeholder={t("form.labels.message")}
            className={`p-3 rounded-md h-32 text-darkBlue resize-none ${
              errors.message ? "border-red border" : "border-grey border"
            }`}
            style={{
              fontFamily: "'Abel', sans-serif",
            }}
          />

          <button
            type="submit"
            className="bg-grey p-3 rounded-md text-white desktop:w-fit uppercase"
            disabled={isSubmitting || isSubmitted}
            style={{
              fontFamily: "'Abel', sans-serif",
            }}
          >
            {isSubmitting ? (
              <span>{t("form.buttons.loading")}</span>
            ) : isSubmitted ? (
              <span>{t("form.buttons.sent")}</span>
            ) : (
              t("form.buttons.send")
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
