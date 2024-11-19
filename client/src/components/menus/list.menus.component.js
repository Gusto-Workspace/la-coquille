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
              <div key={i} className="flex gap-12 items-center sticky top-[62px] bg-extraWhite" style={{height : 'calc(100vh - 158px)'}}>
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

                {menu.dishes.length > 0 ? (
                  <div className="w-1/2 text-center flex flex-col gap-16">
                    {Object.entries(groupDishesByCategory(menu.dishes)).map(
                      ([_, dishes], index) => (
                        <div key={index}>
                          {dishes.map((dish, dishIndex) => (
                            <div key={dish._id} className="text-lg">
                              <p>{dish.name}</p>
                              {dishIndex < dishes.length - 1 && <p>ou</p>}
                            </div>
                          ))}
                        </div>
                      )
                    )}
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
            );
          })}
      </div>
    </section>
  );
}
