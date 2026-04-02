import dataTyped from "../data";
import Cards from "../components/Cards";
import { getCorrectPath } from "../utils/generatePath";

const COLS = 4;

function Home() {
  // Distribuer les items en round-robin dans 4 colonnes
  const columns = Array.from({ length: COLS }, () => [] as typeof dataTyped);

  dataTyped.forEach((card, i) => {
    columns[i % COLS].push(card);
  });

  return (
    <main className="w-full max-w-[1360px] px-6 flex flex-col items-center">
      <div className="flex gap-10 w-full">
        {columns.map((col, colIndex) => (
          <ul key={colIndex} className="flex flex-col gap-10 flex-1 ">
            {col.map((card) => (
              <li key={card.name} className="w-full max-h-325">
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
