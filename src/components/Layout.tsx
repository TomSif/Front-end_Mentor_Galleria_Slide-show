import { Outlet } from "react-router";
import { useState } from "react";
import Header from "./Header";

function Layout() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center max-w-full w-full h-full">
      <Header isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <Outlet context={{ isPlaying }} />
    </div>
  );
}

export default Layout;
