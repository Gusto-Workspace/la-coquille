import { useContext } from "react";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// SVG
import {
  BioSvg,
  GlutenFreeSvg,
  VeganSvg,
  VegetarianSvg,
} from "../_shared/_svgs/_index";

export default function ListDishesComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  console.log(restaurantContext.restaurantData);

  return (
    <section>
      <div
        className="p-12  mx-auto w-full flex flex-col gap-6"
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
            <div key={i} className="flex flex-col gap-6">
              <h2 className="relative text-3xl font-semibold uppercase text-center bg-extraWhite px-6 w-fit mx-auto z-20">
                {category.name}
              </h2>

              <div className="flex flex-col gap-4">
                {category?.dishes
                  .filter((dish) => dish.showOnWebsite)
                  .map((dish, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-4 justify-between"
                    >
                      <div className="flex flex-col">
                        <h3>{dish.name}</h3>

                        <p className="text-sm opacity-50">
                          {dish.description.length > 50
                            ? dish.description.slice(0, 50) + "..."
                            : dish.description}
                        </p>
                      </div>

                      <div className="flex gap-4 items-center">
                        <div className="flex gap-1">
                          {dish.vegan && (
                            <VeganSvg
                              fillColor="white"
                              width={9}
                              height={9}
                              className="bg-red p-1 w-4 h-4 rounded-full opacity-70"
                            />
                          )}

                          {dish.vegetarian && (
                            <VegetarianSvg
                              fillColor="white"
                              width={9}
                              height={9}
                              className="bg-violet p-1 w-4 h-4 rounded-full opacity-70"
                            />
                          )}

                          {dish.bio && (
                            <BioSvg
                              fillColor="white"
                              width={9}
                              height={9}
                              className="bg-darkBlue p-1 w-4 h-4 rounded-full opacity-70"
                            />
                          )}

                          {dish.glutenFree && (
                            <GlutenFreeSvg
                              fillColor="white"
                              width={9}
                              height={9}
                              className="bg-blue p-1 w-4 h-4 rounded-full opacity-70"
                            />
                          )}
                        </div>

                        <p className="text-md font-semibold whitespace-nowrap">
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
