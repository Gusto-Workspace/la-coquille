import { useContext, useEffect, useState } from "react";

// I18N
import { useTranslation } from "next-i18next";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// SVG
import { BioSvg } from "../_shared/_svgs/bio.svg";

export default function ListWinesComponent() {
  const { t } = useTranslation("drinks");
  const { restaurantContext } = useContext(GlobalContext);
  const [categories, setCategories] = useState(
    restaurantContext?.restaurantData?.wine_categories
  );

  const [volumes, setVolumes] = useState();

  useEffect(() => {
    setCategories(restaurantContext?.restaurantData?.wine_categories);
  }, [restaurantContext?.restaurantData]);

  function getAllVolumes(categories) {
    const allVolumes = new Set();

    categories?.forEach((category) => {
      category.wines.forEach((wine) =>
        wine.volumes.forEach((v) => allVolumes.add(v.volume))
      );
      category.subCategories.forEach((subCategory) => {
        subCategory.wines.forEach((wine) =>
          wine.volumes.forEach((v) => allVolumes.add(v.volume))
        );
      });
    });

    return Array.from(allVolumes)
      .map((volume) => {
        const [value, unit] = volume.split(" ");
        const volumeInLiters =
          unit === "CL" ? parseFloat(value) / 100 : parseFloat(value); // Conversion en litres
        return { originalVolume: volume, volumeInLiters };
      })
      .sort((a, b) => a.volumeInLiters - b.volumeInLiters)
      .map((v) => v.originalVolume);
  }

  useEffect(() => {
    setVolumes(getAllVolumes(categories));
  }, [categories]);

  function groupByAppellation(wines) {
    return wines.reduce((acc, wine) => {
      const appellationKey = wine.appellation || "Sans Appellation";
      if (!acc[appellationKey]) acc[appellationKey] = [];
      acc[appellationKey].push(wine);
      return acc;
    }, {});
  }

  return (
    <div>
      <p className="pt-4 pb-12 text-center max-w-[620px] mx-auto font-extralight opacity-70 text-lg">
        {t("wines.description")}
      </p>

      <div
        className="bg-cover bg-center bg-no-repeat rounded-lg drop-shadow-sm shadow-xl p-12 max-w-[1024px] mx-auto w-full flex flex-col gap-6"
        style={{ backgroundImage: "url('/img/assets/wine.webp')" }}
      >
        {categories
          ?.filter(
            (category) =>
              category.visible &&
              (category.wines.some((wine) => wine.showOnWebsite) ||
                category.subCategories.some(
                  (subCategory) =>
                    subCategory.visible &&
                    subCategory.wines.some((wine) => wine.showOnWebsite)
                ))
          )
          .map((category, i) => (
            <div key={i} className="flex flex-col gap-4">
              {/* Titre de la catégorie */}

              <h2 className="text-4xl uppercase text-center px-6 w-fit mx-auto z-20">
                {category.name}
              </h2>

              {/* Volumes affichés en haut à droite */}
              <div className="text-right font-semibold">
                {volumes?.map((v, idx) => (
                  <span key={idx} className="inline-block w-24 text-center">
                    {v}
                  </span>
                ))}
              </div>

              {/* Affichage des vins groupés par appellation */}
              {category.wines.some((wine) => wine.showOnWebsite) && (
                <div className="flex flex-col gap-4">
                  {Object.entries(
                    groupByAppellation(
                      category.wines.filter((wine) => wine.showOnWebsite)
                    )
                  ).map(([appellation, wines], j) => (
                    <div key={j} className="flex flex-col gap-4">
                      {appellation !== "Sans Appellation" && (
                        <h3 className="text-xl font-semibold">{appellation}</h3>
                      )}

                      {wines.map((wine, k) => (
                        <div
                          key={k}
                          className="flex items-center justify-between gap-4 pb-2"
                        >
                          {/* Nom du vin + année */}
                          <div className="flex-1 flex items-center justify-between">
                            <p className="font-medium font-lg">
                              {wine.name}
                              {wine.bio && (
                                <BioSvg
                                  fillColor="white"
                                  width={9}
                                  height={9}
                                  className="bg-darkBlue p-1 w-4 h-4 rounded-full opacity-70 inline-block ml-2"
                                />
                              )}
                            </p>
                            <p className="text-base">{wine.year || "-"}</p>
                          </div>

                          {/* Prix alignés sous les volumes */}
                          <div className="flex">
                            {volumes.map((volume, idx) => {
                              const matchingVolume = wine.volumes.find(
                                (v) => v.volume === volume
                              );
                              return (
                                <p
                                  key={idx}
                                  className="w-24 text-center text-base"
                                >
                                  {matchingVolume
                                    ? `${matchingVolume.price.toFixed(2)} €`
                                    : "-"}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Sous-catégories visibles */}
              {category.subCategories
                .filter(
                  (subCategory) =>
                    subCategory.visible &&
                    subCategory.wines.some((wine) => wine.showOnWebsite)
                )
                .map((subCategory, k) => (
                  <div key={k} className="flex flex-col gap-4 my-2">
                    {/* Nom de la sous-catégorie */}

                    <h3 className="text-2xl italic relative font-semibold px-4 w-fit mx-auto">
                      {subCategory.name}
                    </h3>

                    {Object.entries(
                      groupByAppellation(
                        subCategory.wines.filter((wine) => wine.showOnWebsite)
                      )
                    ).map(([appellation, wines], l) => (
                      <div key={l} className="flex flex-col">
                        {appellation !== "Sans Appellation" && (
                          <h4 className="text-xl font-semibold uppercase pb-2">
                            {appellation}
                          </h4>
                        )}

                        {wines.map((wine, m) => (
                          <div
                            key={m}
                            className="flex items-center justify-between gap-4 pb-2"
                          >
                            {/* Nom du vin + année */}
                            <div className="flex-1 flex items-center justify-between">
                              <p className="font-medium text-lg">
                                {wine.name}
                                {wine.bio && (
                                  <BioSvg
                                    fillColor="white"
                                    width={9}
                                    height={9}
                                    className="bg-darkBlue p-1 w-4 h-4 rounded-full opacity-70 inline-block ml-2"
                                  />
                                )}
                              </p>
                              <p className="text-base">{wine.year || "-"}</p>
                            </div>

                            {/* Prix alignés sous les volumes */}
                            <div className="flex">
                              {volumes?.map((volume, idx) => {
                                const matchingVolume = wine.volumes.find(
                                  (v) => v.volume === volume
                                );
                                return (
                                  <p
                                    key={idx}
                                    className="w-24 text-center text-base"
                                  >
                                    {matchingVolume
                                      ? `${matchingVolume.price.toFixed(2)} €`
                                      : "-"}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}
