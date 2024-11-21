import { useContext } from "react";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

export default function ListMenusComponent() {
  const { restaurantContext } = useContext(GlobalContext);

  function groupDishesByCategory(dishes) {
    return dishes.reduce((acc, dish) => {
      if (!acc[dish.category]) {
        acc[dish.category] = [];
      }
      acc[dish.category].push(dish);
      return acc;
    }, {});
  }

  return (
    <section className="relative">
      <img
        src="/img/assets/4.webp"
        draggable={false}
        alt="ingredient"
        className="max-w-[20%] absolute top-10 left-20 -z-10"
      />

      <img
        src="/img/assets/12.jpeg"
        draggable={false}
        alt="ingredient"
        className="max-w-[35%] absolute bottom-10 left-20 -z-10"
      />

      <img
        src="/img/assets/13.jpeg"
        draggable={false}
        alt="ingredient"
        className="max-w-[20%] absolute top-[60%] -translate-y-1/2 right-20 -z-10"
      />

      <div
        className="flex flex-col gap-24 max-w-[80%] mx-auto py-24 "
        style={{
          fontFamily: "'Abel', sans-serif",
        }}
      >
        {restaurantContext?.restaurantData?.menus
          .filter((menu) => menu.visible)
          .map((menu, i) => {
            return (
              <div
                key={i}
                className={`flex gap-24 items-center ${
                  i % 2 === 0 ? "" : "flex-row-reverse"
                }`}
              >
                <div className="w-1/2 flex flex-col">
                  <h2
                    className="text-5xl"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {menu?.name}
                  </h2>

                  <p className="mb-8 pl-2 text-lg">
                    {menu?.price} {menu?.price && "€"}
                  </p>

                  <div className="relative ml-[40px]">
                    <p className="pl-[40px] text-lg text-balance">
                      {menu?.description}
                    </p>

                    <hr className="absolute w-[1px] h-full bg-brown opacity-20 top-0 " />
                  </div>
                </div>

                <div
                  className="w-[60%] max-w-[5146px] aspect-[5146/6816] pt-6 pb-12 px-6 rounded-md bg-contain bg-center bg-no-repeat flex flex-col"
                  style={{ backgroundImage: "url('/img/menu-1.webp')" }}
                >
                  <div className="pl-[85px] pr-[80px] flex flex-col h-full justify-center py-12 text-extraWhite text-opacity-80">
                    <div>
                      <p className="font-DK_Crayonista text-center text-7xl pb-6 text-balance">
                        {menu.name}
                      </p>

                      <hr className="h-[1px] w-[30%] mb-3 mx-auto opacity-30" />
                    </div>

                    <div className="font-DK_Crayonista relative flex justify-center overflow-y-auto pt-6">
                      {menu.dishes.length > 0 ? (
                        <div className=" text-center flex flex-col">
                          {Object.entries(
                            groupDishesByCategory(menu.dishes)
                          ).map(([_, dishes], index) => (
                            <div key={index} className="z-10 relative py-2">
                              {dishes.map((dish, dishIndex) => (
                                <div
                                  key={dish._id}
                                  className="text-4xl text-balance"
                                >
                                  <p>
                                    {dish.name
                                      .replace(/« /g, "«\u00A0")
                                      .replace(/ »/g, "\u00A0»")}
                                  </p>
                                  {dishIndex < dishes.length - 1 && (
                                    <p className="text-2xl opacity-70">ou</p>
                                  )}
                                </div>
                              ))}
                              {index <
                                Object.entries(
                                  groupDishesByCategory(menu.dishes)
                                ).length -
                                  1 && (
                                <div className="w-12 h-[1px] rounded-full bg-extraWhite mx-auto mt-6 mb-2 opacity-20" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-1/2 text-center flex flex-col gap-6">
                          {menu.combinations.map((combo, index) => (
                            <div key={index} className="flex flex-col gap-2">
                              <p className="flex items-center justify-center">
                                {combo.categories.join(" - ")}
                              </p>

                              <p>{combo.price} €</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
