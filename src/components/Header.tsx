import { Link } from "react-router";

function Header() {
  return (
    <header className="p-6 flex justify-between items-center  border-b-2 border-b-grey-150 sticky top-0 w-full">
      <Link
        to="/"
        aria-label="Go to home page"
        className="flex items-center w-auto "
      >
        <img src="/assets/shared/logo.svg" alt="" className="w-auto h-auto" />
      </Link>
      <span className="text-preset-5-mobile md:text-preset-6 ">
        START SLIDESHOW
      </span>
    </header>
  );
}

export default Header;
