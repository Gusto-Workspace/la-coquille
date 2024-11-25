// I18N
import { useTranslation } from "next-i18next";

export default function StoryHomeComponent() {
  const { t } = useTranslation("index");

  return (
    <section className="bg-white text-center pb-24 pt-72">
      <div className="mb-8 px-6">
        <h3 className="text-sm tracking-wide opacity-70 uppercase">
          {t("story.subtitle")}
        </h3>

        <h2
          className="text-3xl desktop:text-4xl mt-4 mb-6 font-bold tracking-widest uppercase"
          style={{ fontFamily: "'Abel', sans-serif" }}
        >
          {t("story.title")}
        </h2>

        <p
          className="max-w-[620px] mx-auto font-extralight opacity-70 text-lg"
          style={{ fontFamily: "'Abel', sans-serif" }}
        >
          {t("story.description")}
        </p>
      </div>

      <div className="flex flex-col desktop:flex-row max-w-[80%] justify-center gap-8 mt-12 mx-auto">
        <div className="md:w-1/2">
          <img
            src="/img/story-1.jpg"
            alt="restaurant"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
        <div className="md:w-1/2">
          <img
            src="/img/story-2.jpg"
            alt="dish"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </div>
    </section>
  );
}
