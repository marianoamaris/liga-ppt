import logoRey from "../assets/El rey del estampado.png";
import logoFrens from "../assets/Frens Burgers.jpg";
import logoVV from "../assets/V&V Accesorios.jpg";
// Nombre ASCII: evita fallos de build en Linux (NFC/NFD del “ó” en Git/Netlify)
import logoSalon from "../assets/salon-eventos-mariano-amaris.jpg";

export type Patrocinador = {
  id: string;
  nombre: string;
  descripcion: string;
  logo: string;
  /**
   * Usuario de Instagram (sin @). Si no coincide con el perfil real,
   * cámbialo aquí; la URL se arma como https://www.instagram.com/{usuario}/
   */
  instagramHandle: string;
};

/** Aliados de la Liga PPT (perfiles oficiales en Instagram). */
export const PATROCINADORES: Patrocinador[] = [
  {
    id: "rey-estampado",
    nombre: "El Rey del Estampado",
    descripcion:
      "Estampados para camisetas, política, publicidad y mucho más. Personaliza tu ropa con calidad.",
    logo: logoRey,
    instagramHandle: "el_reydelestampado",
  },
  {
    id: "salon-mariano-amaris",
    nombre: "Salón de eventos Mariano Amaris",
    descripcion: "Lugar ideal para celebrar tus eventos: reuniones, fiestas y momentos especiales.",
    logo: logoSalon,
    instagramHandle: "saloneventosma",
  },
  {
    id: "frens-burger",
    nombre: "Frens Burger",
    descripcion: "Las mejores hamburguesas de Valledupar, sabor y buena atención.",
    logo: logoFrens,
    instagramHandle: "frensburgers.vup",
  },
  {
    id: "vv-accesorios",
    nombre: "V&V Accesorios",
    descripcion:
      "Celulares, accesorios y todo lo relacionado con tecnología para equipar tu día a día.",
    logo: logoVV,
    instagramHandle: "vv_accesorios",
  },
];
