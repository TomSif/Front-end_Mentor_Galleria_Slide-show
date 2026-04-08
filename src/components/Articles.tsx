/**
 * DIRECTIONAL ANIMATION ARCHITECTURE — Session 11
 *
 * Problem solved: rapid navigation (goBack → goNext) caused animation glitches
 * because exit direction was shared and mutated across instances.
 *
 * Solution:
 * - SlideWrapper = wrapper component around motion.main (per-instance isolation)
 * - enterDir = frozen at mount via useState + location.state (previous click's direction)
 * - exitDir = dynamic prop from parent Article (current click's direction)
 *
 * Mechanism: When you click goBack:
 *   1. setExitDir(false) → current instance knows it exits leftward
 *   2. navigate({state: {isDirectionRight: false}}) → new instance will inherit
 *      this direction for entry (frozen at SlideWrapper mount)
 *   3. mode="wait" orchestrated by AnimatePresence keeps both instances alive
 *
 * Limitation: ultra-fast navigation (click before animation ends) may cause
 * exitDir to be re-read during animation. Edge case; mode="sync" + position:absolute
 * would solve it, but complicates UX and debugging.
 *
 * See progression.md Session 11 for full analysis of React cycles and timing.
 */
import { useState, useEffect, useRef } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useOutletContext,
  Navigate,
} from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { getCorrectPath } from "../utils/generatePath";
import dataTyped from "../data";

interface SlideWrapperProps {
  exitDir: boolean;
  className: string;
  children: React.ReactNode;
}

function SlideWrapper({ exitDir, className, children }: SlideWrapperProps) {
  const location = useLocation();
  // Frozen at mount: direction of the navigation that brought us HERE
  const [enterDir] = useState<boolean>(
    () => location.state?.isDirectionRight ?? true,
  );
  return (
    <motion.main
      className={className}
      initial={{ x: enterDir ? "-100%" : "100%" }}
      animate={{
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      exit={{
        x: exitDir ? "100%" : "-100%",
        opacity: 0.3,
        transition: { duration: 0.25, ease: "easeIn" },
      }}
    >
      {children}
    </motion.main>
  );
}

function Article() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [exitDir, setExitDir] = useState<boolean>(true);
  const [isHeroSmall, setIsHeroSmall] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(
    location.state?.lightboxOpen ?? false,
  ); // location.state allow state of modal to be share between urls otherwise isOpen(false)
  //handle article Index
  const { isPlaying } = useOutletContext<{ isPlaying: boolean }>();
  const currentArticle = dataTyped.find(
    (article) => getCorrectPath(article.name) === slug,
  );
  const currentArticleIndex = dataTyped.findIndex(
    (article) => getCorrectPath(article.name) === slug,
  );
  const articlesLength = dataTyped.length;
  const progressionWidth = Math.round(
    ((currentArticleIndex + 1) / articlesLength) * 100,
  );
  //handle navigation buttons
  function goBack() {
    const prevIndex =
      (currentArticleIndex - 1 + articlesLength) % articlesLength;
    const prevSlug = getCorrectPath(dataTyped[prevIndex].name);
    setExitDir(false);
    navigate(`/article/${prevSlug}`, {
      state: { lightboxOpen: true, isDirectionRight: false },
    });
  }
  function goNext() {
    const nextIndex = (currentArticleIndex + 1) % articlesLength;
    const nextSlug = getCorrectPath(dataTyped[nextIndex].name);
    setExitDir(true);
    navigate(`/article/${nextSlug}`, {
      state: { lightboxOpen: true, isDirectionRight: true },
    });
  }
  //handle windows size
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
  //handle hero size
  const heroImage = isHeroSmall
    ? currentArticle?.images.hero.small
    : currentArticle?.images.hero.large;
  //handle show modal
  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isOpen]);
  //handle arrows keyboards key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goNext();
      }
      if (e.key === "ArrowLeft") {
        goBack();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentArticleIndex]);
  // function slideshow
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const nextIndex = (currentArticleIndex + 1) % articlesLength;
      const nextSlug = getCorrectPath(dataTyped[nextIndex].name);
      setExitDir(true);
      navigate(`/article/${nextSlug}`, { state: { isDirectionRight: true } });
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, currentArticleIndex, articlesLength, navigate]);

  //fallback is currentArticle is undefined
  if (!currentArticle) return <Navigate to="/404" />;

  return (
    <>
      <dialog
        ref={dialogRef}
        className="w-screen h-screen z-100 bg-black/85 flex items-center justify-center px-6 m-0 max-w-none max-h-none"
      >
        <div className="w-auto h-auto flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-preset-3-mobile text-white text-right"
          >
            CLOSE
          </button>
          <img
            className="md:h-178 h-auto w-full  object-center object-contain"
            src={currentArticle?.images.gallery}
            alt={currentArticle?.name}
          />
        </div>
      </dialog>
      <div
        id="gallery-slideshow"
        role="region"
        aria-label="Gallery slideshow"
        aria-hidden={isOpen || undefined}
      >
        <AnimatePresence mode="wait">
          <SlideWrapper
            key={slug}
            exitDir={exitDir}
            className="flex flex-col  items-center justify-center w-full p-6 md:p-10  xl:flex-row xl:mt-24 lg:gap-6 2xl:gap-36 2xl:px-24 xl:h-156 max-w-93.75 md:max-w-3xl xl:max-w-360 "
          >
            <section className="Image_Container md:flex md:flex-row  w-full 2xl:w-[50vw] xl:h-156">
              <div className="Painting_Container relative w-81.75 h-70 md:w-118.75 md:h-140">
                <img
                  className="h-full w-full  object-center object-cover"
                  src={heroImage}
                  alt={currentArticle?.name}
                />
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="text-white flex gap-4 p-4 w-auto text-preset-7 cursor-pointer bg-black absolute top-4 left-4 md:bottom-4 md:top-auto md:left-4  z-40 hover:bg-white/25 transition-colors ease-in-out duration-500 "
                >
                  <img
                    src="/assets/shared/icon-view-image.svg"
                    alt=""
                    className="w-3 h-3 View_Icon"
                  />
                  VIEW IMAGE
                </button>
              </div>
              <div className="Images_Description  -mt-8  md:mt-0 relative z-20 2xl:w-[20vw]">
                <div className="Description_Content bg-white p-6 w-70.5 md:-ml-58 md:w-111 md:p-0 md:pl-16 md:pb-16 xl:-ml-18  xl:relative">
                  <h1 className="text-preset-2-mobile md:text-preset-2 text-black   text-balance ">
                    {currentArticle?.name}
                  </h1>
                  <h2 className="text-preset-4 text-grey-400 pt-2">
                    {currentArticle?.artist.name}
                  </h2>
                </div>
                <div className="Thumbnails_Container w-full px-4 md:px-6.75 lg:absolute lg:bottom-0">
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
                  className="w-auto text-preset-5-mobile  text-grey-400 hover:text-black transition-colors duration-300"
                >
                  GO TO SOURCE
                </a>
              </div>
            </section>
          </SlideWrapper>
        </AnimatePresence>

        <footer className="border-t w-full border-grey-150 mt-19.5 md:mt-14 xl:mt-10">
          <div
            className="Progession-bar  border-t h-1 border-black -mt-px"
            style={{ width: `${progressionWidth}%` }}
          ></div>
          <div className="Footer_Container flex justify-between items-center w-full px-6 py-4">
            <div className="Footer_Description w-full">
              <h3 className="text-preset-3-mobile text-black text-left">
                {currentArticle?.name}
              </h3>
              <h4 className="text-preset-4-mobile text-black/75">
                {currentArticle?.artist.name}
              </h4>
            </div>
            <div className="Footer_Navigation w-auto flex gap-6">
              <button onClick={() => goBack()} className="w-4 h-4">
                <img
                  src="/assets/shared/icon-back-button.svg"
                  alt="icon back button"
                  className="Back_Button"
                />
              </button>
              <button onClick={() => goNext()} className="w-4 h-4">
                <img
                  src="/assets/shared/icon-next-button.svg"
                  alt="icon next button"
                  className="Next_Button"
                />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Article;
