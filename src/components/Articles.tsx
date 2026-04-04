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
    <main className="flex flex-col  w-full p-6 md:p-10 md:gap-16 lg:flex-row lg:pt-24 lg:pb-20">
      <section className="flex flex-col items-start w-full md:relative md:flex-row">
        <div className="w-auto flex flex-col relative max-w-119">
          <img src={heroImage} alt={currentArticle?.name} />
          <button className="text-white flex gap-4 p-4 w-auto text-preset-7 bg-black absolute top-4 left-4 md:bottom-4 md:top-auto md:left-4 z-40">
            <img
              src="/assets/shared/icon-view-image.svg"
              alt=""
              className="w-3 h-3"
            />
            VIEW IMAGE
          </button>
        </div>
        <div className="flex flex-col   h-42 w-70.5 lg:w-md md:h-auto transform -translate-y-14 lg:-translate-y-0.5 z-20 md:absolute  md:top-14 md:right-16 lg:right-auto lg:top-auto lg:left-100 ">
          <div className="flex flex-col text-left  gap-2 md:gap-6 h-full bg-white p-6 md:p-0 md:pl-16 md:pb-16 md:relative w-full max-w-75 lg:max-w-111 ">
            <h1 className="text-preset-2-mobile md:text-preset-2 text-black max-w-56 lg:w-full text-">
              {currentArticle?.name}
            </h1>
            <h2 className="text-preset-4 text-grey-400">
              {currentArticle?.artist.name}
            </h2>
          </div>
          <img
            className="w-16 h-16 md:w-32 md:h-32 aspect-square object-contain ml-4 md:absolute md:top-59 md:right-0 lg:top-124  lg:right-auto lg:left-24"
            src={currentArticle?.artist.image}
            alt={currentArticle?.artist.name}
          />
        </div>
      </section>
      <section className="flex flex-col items-start md:items-center relative w-full pt-16 md:pt transform -translate-y-24 md:translate-y-0 gap-16 pb-16 md:pb-14">
        <div className="z-30 md:max-w-114 flex flex-col gap-16 md:gap-10">
          <p className="text-preset-3-mobile text-grey-400 text-left ">
            {currentArticle?.description}
          </p>
          <a
            href={currentArticle?.source}
            aria-label="Go to home page"
            className="w-auto text-preset-5-mobile md:self-start text-grey-400"
          >
            GO TO SOURCE
          </a>
        </div>
        <p className="text-preset-1-mobile md:text-preset-1 text-grey-100 absolute top-0 left-22 md:left-0 z-20 w-auto h-25">
          {currentArticle?.year}
        </p>
      </section>
    </main>
  );
}

export default Article;
