import { useMemo } from "react";
import dataTyped from "../data";
import Cards from "../components/Cards";
import { getCorrectPath } from "../utils/generatePath";
import solveMasonry from "../utils/solveMasonry";
import useColumns from "../hooks/useColumns";

const GAP = 40;

function Home() {
  const cols = useColumns();

  const columns = useMemo(
    () =>
      solveMasonry(dataTyped, (card) => card.images.thumbnailHeight, cols, GAP),
    [cols],
  );

  return (
    <main className="w-full max-w-340 px-6 flex flex-col items-center">
      <div className="flex gap-10 w-full">
        {columns.map((col, colIndex) => (
          <ul key={colIndex} className="flex flex-col gap-10 flex-1">
            {col.map((card) => (
              <li key={card.name} className="w-full">
                <Cards
                  name={card.name}
                  thumbnail={card.images.thumbnail}
                  artistName={card.artist.name}
                  path={getCorrectPath(card.name)}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </main>
  );
}

export default Home;
