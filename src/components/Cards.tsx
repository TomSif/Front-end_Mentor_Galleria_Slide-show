import { Link } from "react-router";

interface CardsProps {
  name: string;
  thumbnail: string;
  artistName: string;
  path: string;
}

function Cards({ name, thumbnail, artistName, path }: CardsProps) {
  return (
    <Link
      className="card flex flex-col  relative w-full h-auto  "
      to={`/article/${path}`}
    >
      <img
        className="w-full h-auto object-cover card_img"
        src={thumbnail}
        alt={name}
      />
      <div className="overlay"></div>
      <div className="flex flex-col gap-2 items-start text-left absolute left-8 bottom-8">
        <strong className="text-preset-2-mobile text-white">{name}</strong>
        <span className="text-preset-5 text-white/75">{artistName}</span>
      </div>
    </Link>
  );
}

export default Cards;
