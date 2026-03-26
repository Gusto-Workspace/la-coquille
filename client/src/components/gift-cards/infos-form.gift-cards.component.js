import { useEffect } from "react";
import { useForm } from "react-hook-form";

const DEFAULT_GIFT_CARD_SETTINGS = {
  validity_mode: "fixed_duration",
  validity_fixed_months: 6,
  validity_until_day: 25,
  validity_until_month: 6,
};

const MONTH_LABELS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function clampInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(Math.max(parsed, min), max);
}

function normalizeGiftCardSettings(settings) {
  return {
    validity_mode:
      settings?.validity_mode === "until_date"
        ? "until_date"
        : DEFAULT_GIFT_CARD_SETTINGS.validity_mode,
    validity_fixed_months: clampInteger(
      settings?.validity_fixed_months,
      DEFAULT_GIFT_CARD_SETTINGS.validity_fixed_months,
      1,
      60,
    ),
    validity_until_day: clampInteger(
      settings?.validity_until_day,
      DEFAULT_GIFT_CARD_SETTINGS.validity_until_day,
      1,
      31,
    ),
    validity_until_month: clampInteger(
      settings?.validity_until_month,
      DEFAULT_GIFT_CARD_SETTINGS.validity_until_month,
      1,
      12,
    ),
  };
}

function buildGiftCardValidityLabel(settings) {
  const nextSettings = normalizeGiftCardSettings(settings);

  if (nextSettings.validity_mode === "until_date") {
    const monthLabel =
      MONTH_LABELS[nextSettings.validity_until_month - 1] || MONTH_LABELS[5];

    return `valable jusqu'au ${nextSettings.validity_until_day} ${monthLabel}`;
  }

  return `valable ${nextSettings.validity_fixed_months} mois à compter de la date d'achat`;
}

export default function InfosFormGiftCardsComponent({
  onSubmit,
  onChange,
  formData,
  giftCard,
  giftCardSettings,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  // ✅ IMPORTANT: quand formData change (restore localStorage), on reset le form RHF
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const handleFieldChange = (fieldName) => (e) => {
    onChange({
      [fieldName]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  // ✅ onSubmit reçoit les valeurs RHF (plus fiable)
  const submit = (values) => {
    // sync parent (au cas où)
    onChange(values);
    onSubmit(values);
  };

  const validityLabel = buildGiftCardValidityLabel(giftCardSettings);

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="rounded-2xl border border-darkBlue/10 bg-white/50 p-4">
        <p className="text-base desktop:text-lg font-semibold text-darkBlue mb-2">
          Information carte cadeau
        </p>

        {/* Bénéficiaire */}
        <div className="mb-4">
          <label
            htmlFor="beneficiaryFirstName"
            className="block desktop:text-lg font-semibold mb-2"
          >
            Bénéficiaire
          </label>

          <div className="flex gap-4">
            <input
              id="beneficiaryFirstName"
              type="text"
              placeholder="Prénom du bénéficiaire"
              {...register("beneficiaryFirstName", { required: true })}
              className={`border rounded-lg w-full p-2 text-lg max-w-56 ${
                errors.beneficiaryFirstName ? "border-red" : ""
              }`}
              onChange={handleFieldChange("beneficiaryFirstName")}
            />
            <input
              id="beneficiaryLastName"
              type="text"
              placeholder="Nom du bénéficiaire"
              {...register("beneficiaryLastName", { required: true })}
              className={`border rounded-lg w-full p-2 text-lg max-w-56 ${
                errors.beneficiaryLastName ? "border-red" : ""
              }`}
              onChange={handleFieldChange("beneficiaryLastName")}
            />
          </div>
        </div>

        {/* De la part de (affiché sur la carte) */}
        <div className="mb-4">
          <label
            htmlFor="sender"
            className="block desktop:text-lg font-semibold mb-2"
          >
            De la part de
          </label>

          <input
            id="sender"
            type="text"
            placeholder="Écrire ..."
            {...register("sender", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg max-w-[465px] ${
              errors.sender ? "border-red" : ""
            }`}
            onChange={handleFieldChange("sender")}
          />
        </div>

        {/* Commentaire */}
        <div>
          <label
            htmlFor="comment"
            className="block desktop:text-lg font-semibold mb-2"
          >
            Ajouter un commentaire sur la carte{" "}
            <span className="text-sm italic opacity-30">(facultatif)</span>
          </label>

          <textarea
            id="comment"
            placeholder="Votre commentaire"
            {...register("comment")}
            className="border rounded-lg w-full p-2 text-lg resize-none"
            onChange={handleFieldChange("comment")}
            maxLength={80}
          />
        </div>

        {/* Checkbox Masquer le prix */}
        {giftCard?.description && (
          <div className="flex items-center gap-2 mt-4">
            <input
              id="hidePrice"
              type="checkbox"
              {...register("hidePrice")}
              className="w-5 h-5"
              onChange={handleFieldChange("hidePrice")}
            />
            <label htmlFor="hidePrice" className="desktop:text-lg">
              Masquer le prix lors de l'envoi du bon cadeau
            </label>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-darkBlue/10 bg-white/50 p-4">
        <p className="text-base desktop:text-lg font-semibold text-darkBlue mb-2">
          Vos informations
        </p>

        {/* Email */}
        <div className="mb-4">
          <input
            id="sendEmail"
            type="email"
            placeholder="Adresse email"
            {...register("sendEmail", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg ${
              errors.sendEmail ? "border-red" : ""
            }`}
            onChange={handleFieldChange("sendEmail")}
          />
        </div>

        {/* Prénom / Nom */}
        <div className="flex gap-4 mb-4">
          <input
            id="buyerFirstName"
            type="text"
            placeholder="Votre prénom"
            {...register("buyerFirstName", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg ${
              errors.buyerFirstName ? "border-red" : ""
            }`}
            onChange={handleFieldChange("buyerFirstName")}
          />
          <input
            id="buyerLastName"
            type="text"
            placeholder="Votre nom"
            {...register("buyerLastName", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg ${
              errors.buyerLastName ? "border-red" : ""
            }`}
            onChange={handleFieldChange("buyerLastName")}
          />
        </div>

        {/* Téléphone */}
        <div>
          <input
            id="buyerPhone"
            type="tel"
            placeholder="Votre téléphone"
            {...register("buyerPhone", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg ${
              errors.buyerPhone ? "border-red" : ""
            }`}
            onChange={handleFieldChange("buyerPhone")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="underline uppercase">Important</p>

        <p className="italic">
          La carte cadeau est{" "}
          <strong className="uppercase underline">
            {validityLabel}
          </strong>
          . Une fois le paiement effectué, la carte cadeau sera envoyée par mail
          à l'adresse renseignée ci-dessus. Cet email contiendra également un
          code unique à transmettre directement au restaurant le jour
          d'utilisation de la carte cadeau.
        </p>
      </div>

      {/* Bouton Valider */}
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-lg text-extraWhite text-lg bg-grey"
      >
        Procéder au paiement
      </button>
    </form>
  );
}
