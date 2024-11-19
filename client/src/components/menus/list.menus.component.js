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
    <section className="py-24">
      <div className="flex flex-col gap-24 max-w-[80%] mx-auto">
        {restaurantContext?.restaurantData?.menus
          .filter((menu) => menu.visible)
          .map((menu, i) => {
            return (
              <div key={i} className="menu">
                <h2>{menu?.name}</h2>
                <p>{menu?.description}</p>
                <p>
                  {menu?.price} {menu?.price && "€"}
                </p>

                {menu.dishes.length > 0 ? (
                  <div className="menu-dishes">
                    {Object.entries(groupDishesByCategory(menu.dishes)).map(
                      ([category, dishes], index) => (
                        <div key={index} className="category">
                          <ul>
                            {dishes.map((dish) => (
                              <li key={dish._id}>
                                <span>{dish.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="menu-combinations">
                    {menu.combinations.length > 0 ? (
                      menu.combinations.map((combo, index) => (
                        <div key={index} className="combination">
                          <ul>
                            {combo.categories.map((category, catIndex) => (
                              <li key={catIndex}>{category}</li>
                            ))}
                          </ul>
                          <p>Prix: {combo.price} €</p>
                        </div>
                      ))
                    ) : (
                      <p>Ce menu n'a pas de plats ou de combinaisons.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
}
