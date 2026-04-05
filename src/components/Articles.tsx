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
      if (width >= 768) setIsHeroSmall(false);
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
    <main className="flex flex-col  justify-center w-full p-6 md:p-10  xl:flex-row lg:pt-24 lg:pb-20 lg:gap-6">
      <section className="Image_Container md:flex md:flex-row">
        <div className="Painting_Container relative lg:w-118.75 max-w-118.75 xl:h-140">
          <img src={heroImage} alt={currentArticle?.name} />
          <button className="text-white flex gap-4 p-4 w-auto text-preset-7 bg-black absolute top-4 left-4 md:bottom-4 md:top-auto md:left-4  z-40">
            <img
              src="/assets/shared/icon-view-image.svg"
              alt=""
              className="w-3 h-3 "
            />
            VIEW IMAGE
          </button>
        </div>
        <div className="Images_Description  -mt-8  md:mt-0 relative z-20">
          <div className="Description_Content bg-white p-6 w-70.5 md:-ml-58 md:w-111 md:p-0 md:pl-16 md:pb-16 xl:-ml-18">
            <h1 className="text-preset-2-mobile md:text-preset-2 text-black   text-balance ">
              {currentArticle?.name}
            </h1>
            <h2 className="text-preset-4 text-grey-400 pt-2">
              {currentArticle?.artist.name}
            </h2>
          </div>
          <div className="Thumbnails_Container w-full px-4 md:px-6.75 xl:pt-49">
            <img
              className="Description_Thumbnails w-16 h-16 md:w-32 md:h-32 aspect-square object-contain  "
              src={currentArticle?.artist.image}
              alt={currentArticle?.artist.name}
            />
          </div>
        </div>
      </section>
      <section className="Detail_Container relative -mt-8 md:mt-16 xl:mt-0 xl:pt-27.5 w-full">
        <p className="Year text-preset-1-mobile md:text-preset-1 text-grey-100 w-full text-right md:text-left  absolute top-0 right-0 md:right-auto md:left-0 xl:top-7 z-30">
          {currentArticle?.year}
        </p>
        <div className="Additionnal_Info_Container relative py-16 z-40 md:mx-auto md:w-114 xl:w-87.5 xl:mx-0">
          <p className="text-preset-3-mobile text-grey-400 text-left pb-16 md:pb-10">
            {currentArticle?.description}
          </p>
          <a
            href={currentArticle?.source}
            aria-label="Go to home page"
            className="w-auto text-preset-5-mobile  text-grey-400 "
          >
            GO TO SOURCE
          </a>
        </div>
      </section>
    </main>
  );
}

export default Article;
