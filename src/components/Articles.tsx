import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getCorrectPath } from "../utils/generatePath";
import dataTyped from "../data";

function Article() {
  const [isHeroSmall, setIsHeroSmall] = useState<boolean>(true);
  const { slug } = useParams();
  const currentArticle = dataTyped.find(
    (article) => getCorrectPath(article.name) === slug,
  );

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 640) setIsHeroSmall(false);
      else setIsHeroSmall(true);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const heroImage = isHeroSmall
    ? currentArticle?.images.hero.small
    : currentArticle?.images.hero.large;

  return (
    <div className="flex flex-col  w-full p-6">
      <div className="flex flex-col items-start w-full">
        <img
          className="w-auto h-auto object-cover aspect-[3.3/2.7] z-10"
          src={heroImage}
          alt={currentArticle?.name}
        />
        <div className="flex flex-col   h-42 w-70.5 transform -translate-y-14 z-20">
          <div className="flex flex-col text-left  gap-2 h-full bg-white p-6">
            <h1 className="text-preset-2-mobile text-black">
              {currentArticle?.name}
            </h1>
            <h2 className="text-preset-4 text-grey-400">
              {currentArticle?.artist.name}
            </h2>
          </div>
          <img
            className="w-16 h-16 aspect-square object-contain ml-4"
            src={currentArticle?.artist.image}
            alt={currentArticle?.artist.name}
          />
        </div>
      </div>
    </div>
  );
}

export default Article;
