import { useContext, useState } from "react";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// I18N
import { useTranslation } from "next-i18next";

// SVG
import {
  BioSvg,
  GlutenFreeSvg,
  VeganSvg,
  VegetarianSvg,
} from "../_shared/_svgs/_index";

export default function ListDishesComponent() {
  const { t } = useTranslation("dishes");
  const { restaurantContext } = useContext(GlobalContext);

  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  return (
    <section>
      <div
        className="py-24 mx-auto w-full flex flex-col gap-24"
        style={{
          fontFamily: "'Abel', sans-serif",
        }}
      >
        {restaurantContext?.restaurantData?.dish_categories
          ?.filter(
            (category) =>
              category.visible &&
              category.dishes.some((dish) => dish.showOnWebsite)
          )
          .map((category, i) => (
            <div key={i} className="flex flex-col gap-16">
              <div className="flex flex-col gap-4">
                <h2 className="relative text-3xl font-semibold uppercase text-center bg-extraWhite px-6 w-fit mx-auto">
                  {category.name}
                </h2>

                <p className="max-w-[620px] mx-auto font-extralight opacity-70 text-lg text-center">
                  {category.description}
                </p>
              </div>

              <div className="w-[80%] mx-auto grid grid-cols-1 tablet:grid-cols-1 desktop:grid-cols-2 gap-y-6 gap-x-16">
                {category?.dishes
                  .filter((dish) => dish.showOnWebsite)
                  .map((dish, j) => (
                    <div key={j} className="flex gap-4 justify-between">
                      <div className="flex gap-4">
                        <div className="text-lg flex flex-col">
                          <h3 className="leading-6 bg-extraWhite flex gap-3 pr-2">
                           <span className="">{dish.name}</span> 

                            <span className="flex gap-1 relative">
                              {dish.vegan && (
                                <div
                                  onMouseEnter={() =>
                                    setHoveredTooltip(`${dish._id}-vegan`)
                                  }
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                  className="relative"
                                >
                                  <VeganSvg
                                    fillColor="white"
                                    width={19}
                                    height={19}
                                    className="bg-red p-1 w-5 h-5 mt-1 rounded-full opacity-70"
                                  />
                                  {hoveredTooltip === `${dish._id}-vegan` && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-darkBlue text-white text-xs p-2 rounded-lg whitespace-nowrap z-50">
                                      {t("types.vegan")}
                                    </div>
                                  )}
                                </div>
                              )}

                              {dish.vegetarian && (
                                <div
                                  onMouseEnter={() =>
                                    setHoveredTooltip(`${dish._id}-vegetarian`)
                                  }
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                  className="relative"
                                >
                                  <VegetarianSvg
                                    fillColor="white"
                                    width={19}
                                    height={19}
                                    className="bg-violet p-1 w-5 h-5 mt-1 rounded-full opacity-70"
                                  />
                                  {hoveredTooltip ===
                                    `${dish._id}-vegetarian` && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-darkBlue text-white text-xs p-2 rounded-lg whitespace-nowrap z-50">
                                      {t("types.vegetarian")}
                                    </div>
                                  )}
                                </div>
                              )}

                              {dish.bio && (
                                <div
                                  onMouseEnter={() =>
                                    setHoveredTooltip(`${dish._id}-bio`)
                                  }
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                  className="relative"
                                >
                                  <BioSvg
                                    fillColor="white"
                                    width={19}
                                    height={19}
                                    className="bg-darkBlue p-1 w-5 h-5 mt-1 rounded-full opacity-70"
                                  />
                                  {hoveredTooltip === `${dish._id}-bio` && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-darkBlue text-white text-xs p-2 rounded-lg whitespace-nowrap z-50">
                                      {t("types.bio")}
                                    </div>
                                  )}
                                </div>
                              )}

                              {dish.glutenFree && (
                                <div
                                  onMouseEnter={() =>
                                    setHoveredTooltip(`${dish._id}-glutenFree`)
                                  }
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                  className="relative"
                                >
                                  <GlutenFreeSvg
                                    fillColor="white"
                                    width={19}
                                    height={19}
                                    className="bg-blue p-1 w-5 h-5 mt-1 rounded-full opacity-70"
                                  />
                                  {hoveredTooltip ===
                                    `${dish._id}-glutenFree` && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-darkBlue text-white text-xs p-2 rounded-lg whitespace-nowrap z-50">
                                      {t("types.gluttenFree")}
                                    </div>
                                  )}
                                </div>
                              )}
                            </span>
                          </h3>

                          <p className="text-sm opacity-50">
                            {dish.description.length > 50
                              ? dish.description.slice(0, 50) + "..."
                              : dish.description}
                          </p>
                        </div>
                      </div>

                      <hr className="flex-grow h-[1px] bg-grey opacity-20 mt-[14px] -z-10" />

                      <div className="flex gap-4 bg-extraWhite pl-2">
                        <p className="text-lg whitespace-nowrap">
                          {dish.price.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}