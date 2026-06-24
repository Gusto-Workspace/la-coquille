const DEFAULT_GIFT_CARD_VISUAL = {
  visualId: "",
  name: "Visuel par défaut",
  imageUrl: "/img/assets/bg-gift-card.png",
  textColor: "#000000",
  textLayout: "right",
};

function getGiftCardVisuals(giftCardSettings) {
  return Array.isArray(giftCardSettings?.visuals)
    ? giftCardSettings.visuals
    : [];
}

export function normalizeGiftCardVisual(visual) {
  if (!visual) return DEFAULT_GIFT_CARD_VISUAL;

  return {
    visualId: String(visual._id || visual.visualId || ""),
    name: visual.name || DEFAULT_GIFT_CARD_VISUAL.name,
    imageUrl: visual.imageUrl || DEFAULT_GIFT_CARD_VISUAL.imageUrl,
    textColor: /^#[0-9a-fA-F]{6}$/.test(visual.textColor || "")
      ? visual.textColor
      : DEFAULT_GIFT_CARD_VISUAL.textColor,
    textLayout: ["right", "center", "left"].includes(visual.textLayout)
      ? visual.textLayout
      : DEFAULT_GIFT_CARD_VISUAL.textLayout,
  };
}

export function resolveGiftCardVisual(giftCard, giftCardSettings) {
  const visuals = getGiftCardVisuals(giftCardSettings);
  const giftVisual = visuals.find(
    (visual) => String(visual._id) === String(giftCard?.visualId || ""),
  );
  const defaultVisual = visuals.find(
    (visual) =>
      String(visual._id) === String(giftCardSettings?.defaultVisualId || ""),
  );

  return normalizeGiftCardVisual(giftVisual || defaultVisual || visuals[0]);
}

function getTextPositionClasses(layout) {
  if (layout === "left") return "left-0 items-center text-center";
  if (layout === "center") {
    return "left-1/2 -translate-x-1/2 items-center text-center";
  }
  return "right-0 items-center text-center";
}

export default function GiftCardVisualPreview({
  visual,
  giftCard,
  giftCardSettings,
  value,
  description,
  formData,
  hidePrice = false,
  className = "",
}) {
  const resolvedVisual = visual
    ? normalizeGiftCardVisual(visual)
    : resolveGiftCardVisual(giftCard, giftCardSettings);
  const beneficiaryName = [
    formData?.beneficiaryFirstName,
    formData?.beneficiaryLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const amountLabel =
    !hidePrice && value !== undefined && value !== null && value !== ""
      ? `${value} €`
      : "";

  return (
    <div
      className={`relative aspect-[16/9] overflow-hidden border bg-center bg-cover bg-no-repeat shadow-xl drop-shadow-xl [container-type:inline-size] ${className}`}
      style={{ backgroundImage: `url(${resolvedVisual.imageUrl})` }}
      aria-label="Aperçu carte cadeau"
    >
      <div
        className={`absolute inset-y-0 flex w-[62%] flex-col justify-center gap-[2.1%] px-[3%] ${getTextPositionClasses(
          resolvedVisual.textLayout,
        )}`}
        style={{ color: resolvedVisual.textColor }}
      >
        <h1 className="text-[clamp(14px,5cqw,34px)] font-bold leading-none">
          Carte cadeau
        </h1>

        {amountLabel ? (
          <p className="text-[clamp(10px,3.1cqw,24px)] leading-tight">
            {amountLabel}
          </p>
        ) : null}

        {description ? (
          <p className="max-w-[88%] text-center text-[clamp(8px,2.55cqw,20px)] leading-tight">
            {description}
          </p>
        ) : null}

        {beneficiaryName ? (
          <p className="text-[clamp(8px,2.4cqw,20px)] leading-tight">
            <span className="italic">Pour :</span> {beneficiaryName}
          </p>
        ) : null}

        {formData?.comment ? (
          <p className="max-w-[88%] text-center text-[clamp(7px,2.1cqw,16px)] leading-tight">
            &quot;{formData.comment}&quot;
          </p>
        ) : null}

        {formData?.sender ? (
          <p className="text-[clamp(8px,2.4cqw,20px)] leading-tight">
            <span className="italic">De la part de :</span> {formData.sender}
          </p>
        ) : null}
      </div>
    </div>
  );
}
