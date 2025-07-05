export const THEME = {
  logo: {
    escudo: "/ligaPPT-escudo.png",
  },
  colors: {
    // Sidebar: degradado de negro a gris oscuro
    primary: "bg-gradient-to-b from-black via-gray-900 to-gray-800", // sidebar fondo
    secondary: "bg-gray-800", // para cards y acentos
    accent: "bg-white", // para botones o detalles
    hover: "bg-gray-500", // hover en sidebar
    selected: "bg-gray-200 text-black font-bold", // item seleccionado
    text: {
      primary: "text-white",
      secondary: "text-gray-300",
      accent: "text-black",
      dark: "text-gray-900",
    },
    border: "border-gray-700",
    card: "bg-white text-gray-900",
    cardAlt: "bg-gray-100 text-gray-900",
  },
} as const;

export const SIDEBAR_ITEMS = [
  {
    id: "home",
    label: "Inicio",
    path: "/",
    icon: "FaHome",
  },
  {
    id: "clasificacion",
    label: "Clasificación",
    path: "/clasificacion",
    icon: "FaRankingStar",
  },
  {
    id: "historia",
    label: "Historia",
    path: "/historia",
    icon: "GiWhistle",
  },
  {
    id: "logros",
    label: "Logros",
    path: "/logros",
    icon: "FaMedal",
  },
  {
    id: "reglamento",
    label: "Reglamento",
    path: "/reglamento",
    icon: "FaGavel",
  },
  {
    id: "anuncios",
    label: "Anuncios",
    path: "/anuncios",
    icon: "FaBullhorn",
  },
  {
    id: "contacto",
    label: "Contacto",
    path: "/contacto",
    icon: "GiSoccerKick",
  },
  {
    id: "calendario",
    label: "Calendario",
    path: "/calendario",
    icon: "FaRegCalendarAlt",
  },
] as const;
