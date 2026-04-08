import { useMemo } from "react";
import { motion } from "framer-motion";
import dataTyped from "../data";
import Cards from "../components/Cards";
import { getCorrectPath } from "../utils/generatePath";
import solveMasonry from "../utils/solveMasonry";
import useColumns from "../hooks/useColumns";

const GAP = 40;
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1125 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -80 },
  visible: { opacity: 1, y: 0 },
};

function Home() {
  const cols = useColumns();

  const columns = useMemo(
    () =>
      solveMasonry(dataTyped, (card) => card.images.thumbnailHeight, cols, GAP),
    [cols],
  );

  return (
    <main className="w-full h-full pb-8 max-w-340 px-6 flex flex-col items-center">
      <h1 className="sr-only">A collection of the most famous paintings</h1>
      <div className="flex gap-10 w-full">
        {/* A11y has been sacrified for design purpose, one ul would have been a better semantic structure */}
        {columns.map((col, colIndex) => (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={colIndex}
            className="flex flex-col gap-10 flex-1 pt-10"
          >
            {col.map((card) => (
              <motion.li
                variants={itemVariants}
                key={card.name}
                className="w-full "
              >
                <Cards
                  name={card.name}
                  thumbnail={card.images.thumbnail}
                  artistName={card.artist.name}
                  path={getCorrectPath(card.name)}
                />
              </motion.li>
            ))}
          </motion.ul>
        ))}
      </div>
    </main>
  );
}

export default Home;
