import React from "react";
import { useMediaQuery } from "react-responsive";
import HomeDesktop from "../components/Home/HomeDesktop";
import HomeMobile from "../components/Home/HomeMobile";
import HomeTablet from "../components/Home/HomeTablet";

export const Home: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  // Desktop: minWidth 1024

  if (isMobile) return <HomeMobile />;
  if (isTablet) return <HomeTablet />;
  return <HomeDesktop />;
};
