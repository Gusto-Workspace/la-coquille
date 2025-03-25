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
        className="max-w-[40%] desktop:max-w-[20%] absolute top-0 desktop:top-10 right-0 desktop:left-20 -z-10"
      />

      <img
        src="/img/assets/12.jpeg"
        draggable={false}
        alt="ingredient"
        className="max-w-[325px] desktop:max-w-[550px] absolute bottom-0 left-1/2 -translate-x-1/2 -z-10"
      />

      <div
        className="flex flex-col gap-12 desktop:gap-24 desktop:max-w-[80%] mx-auto pt-24 pb-36 desktop:pb-72"
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
                className={`max-w-[80%] mx-auto desktop:min-w-full flex flex-col desktop:flex-row gap-0 desktop:gap-24 items-center ${
                  i % 2 === 0 ? "" : "desktop:flex-row-reverse"
                }`}
              >
                <div className="w-full desktop:w-1/2 flex flex-col mb-12 desktop:mb-0">
                  <h2
                    className="text-5xl"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {menu?.name}
                  </h2>

                  <p className="mb-8 pl-2 text-2xl">
                    {menu?.price} {menu?.price && "€"}
                  </p>

                  <div className="relative desktop:ml-[40px]">
                    <p className="pl-[40px] text-lg text-balance">
                      {menu?.description}
                    </p>

                    <hr className="absolute w-[1px] h-full bg-brown opacity-20 top-0 " />
                  </div>
                </div>

                <div
                  className="desktop:w-[60%] max-w-[100%] max-h-[550px] desktop:max-h-full aspect-[5146/6816] py-6 px-6 rounded-md bg-contain bg-center bg-no-repeat flex flex-col"
                  style={{ backgroundImage: "url('/img/menu-1.webp')" }}
                >
                  <div className="pl-4 pr-3 desktop:max-w-[80%] mx-auto flex flex-col h-full justify-center desktop:py-6 text-extraWhite text-opacity-80">
                    <div>
                      <p className="mx-auto font-DK_Crayonista text-center text-4xl desktop:text-7xl pb-2 desktop:pb-6 text-balance">
                        {menu.name}
                      </p>

                      <hr className="h-[1px] w-[30%] mb-3 mx-auto opacity-30" />
                    </div>

                    <div className="font-DK_Crayonista relative flex justify-center overflow-y-auto pt-2 desktop:pt-6">
                      {menu.dishes.length > 0 ? (
                        <div className="text-center flex flex-col ">
                          {Object.entries(
                            groupDishesByCategory(menu.dishes)
                          ).map(([_, dishes], index) => (
                            <div
                              key={index}
                              className="z-10 relative desktop:py-2"
                            >
                              {dishes.map((dish, dishIndex) => (
                                <div
                                  key={dish._id}
                                  className="text-2xl desktop:text-4xl text-balance"
                                >
                                  <p>
                                    {dish.name
                                      .replace(/« /g, "«\u00A0")
                                      .replace(/ »/g, "\u00A0»")}
                                  </p>
                                  {dishIndex < dishes.length - 1 && (
                                    <p className="text-xl opacity-70 leading-5">
                                      ou
                                    </p>
                                  )}
                                </div>
                              ))}
                              {index <
                                Object.entries(
                                  groupDishesByCategory(menu.dishes)
                                ).length -
                                  1 && (
                                <div className="w-12 h-[1px] rounded-full bg-extraWhite mx-auto my-2 desktop:mt-6 desktop:mb-2 opacity-20" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center flex flex-col gap-2">
                          {menu.combinations.map((combo, index) => (
                            <div key={index} className="flex flex-col gap-2">
                              <p className="text-2xl desktop:text-4xl text-balance">
                                {combo.categories.join(" - ")}
                              </p>

                              <p className="text-xl desktop:text-4xl">
                                {combo.price} €
                              </p>
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
