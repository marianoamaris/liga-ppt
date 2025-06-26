import { useMediaQuery } from "react-responsive";
import ClasificacionMobile from "../Clasificacion/ClasificacionMobile";
import ClasificacionTablet from "../Clasificacion/ClasificacionTablet";
import ClasificacionDesktop from "../Clasificacion/ClasificacionDesktop";

export const Clasificacion: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  // Desktop: minWidth 1024

  if (isMobile) return <ClasificacionMobile />;
  if (isTablet) return <ClasificacionTablet />;
  return <ClasificacionDesktop />;
};
