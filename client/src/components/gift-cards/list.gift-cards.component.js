// COMPONENTS
import CardGiftCardsComponent from "./card.gift-cards.component";

export default function ListGiftCardsComponent() {
 

  return (
    <section className="max-w-[80%] mx-auto py-24 flex flex-col gap-12">
      <CardGiftCardsComponent
        title="titles.value"
        description="descriptions.value"
        filterCondition={(giftCard) => !giftCard.description}
      />

      <CardGiftCardsComponent
        title="titles.menus"
        description="descriptions.menus"
        filterCondition={(giftCard) => giftCard.description}
      />
    </section>
  );
}