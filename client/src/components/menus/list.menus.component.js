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
    <section className="">
      <div
        className="flex flex-col gap-48 max-w-[80%] mx-auto"
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
                className="flex gap-24 items-center sticky top-[62px] py-12 bg-extraWhite"
                style={{ minHeight: "calc(100vh - 62px)" }}
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
                    <p className="pl-[40px] text-lg">{menu?.description}</p>

                    <hr className="absolute w-[1px] h-full bg-brown opacity-20 top-0 " />
                  </div>
                </div>

                <div className=" w-1/2 pt-6 pb-12 px-6 rounded-md border-grey border border-opacity-20">
                  <p
                    className="text-center text-3xl mb-12 pb-6 border-b border-grey border-opacity-20"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {menu.name}
                  </p>

                  <div className="relative flex justify-center">
                    {menu.dishes.length > 0 ? (
                      <div className=" text-center flex flex-col gap-12">
                        {Object.entries(groupDishesByCategory(menu.dishes)).map(
                          ([_, dishes], index) => (
                            <div
                              key={index}
                              className="py-4 bg- z-10 relative bg-extraWhite"
                            >
                              {dishes.map((dish, dishIndex) => (
                                <div key={dish._id} className="text-lg">
                                  <p>{dish.name}</p>
                                  {dishIndex < dishes.length - 1 && (
                                    <p className="text-sm opacity-50">ou</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )
                        )}
                        <hr className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[1px] h-full bg-grey opacity-20" />
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
            );
          })}
      </div>
    </section>
  );
}
