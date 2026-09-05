import logoRey from "../assets/LOGOS_MIN/El rey del estampado.webp";
import logoFrens from "../assets/LOGOS_MIN/Frens Burgers.webp";
import logoVV from "../assets/LOGOS_MIN/V&V Accesorios.webp";
// Nombre ASCII: evita fallos de build en Linux (NFC/NFD del “ó” en Git/Netlify)
import logoSalon from "../assets/LOGOS_MIN/salon-eventos-mariano-amaris.webp";
import logoAndariego from "../assets/LOGOS_MIN/Andariego.webp";
import logoDondeVaro from "../assets/LOGOS_MIN/Donde Varo.webp";

export type Patrocinador = {
  id: string;
  nombre: string;
  descripcion: string;
  logo: string;
  /**
   * Ciudades donde el negocio acompaña a la liga. Es una lista porque una
   * cadena puede patrocinar en varias; los seis actuales son de Valledupar,
   * y varios lo dicen en su propia descripción.
   */
  sedes: string[];
  /**
   * Usuario de Instagram (sin @). Si no coincide con el perfil real,
   * cámbialo aquí; la URL se arma como https://www.instagram.com/{usuario}/
   */
  instagramHandle: string;
};

/** Aliados de la Liga PPT (perfiles oficiales en Instagram), por ciudad. */
export const PATROCINADORES: Patrocinador[] = [
  {
    id: "rey-estampado",
    nombre: "El Rey del Estampado",
    descripcion:
      "Estampados para camisetas, política, publicidad y mucho más. Personaliza tu ropa con calidad.",
    logo: logoRey,
    instagramHandle: "el_reydelestampado",
    sedes: ["vup"],
  },
  {
    id: "salon-mariano-amaris",
    nombre: "Salón de eventos Mariano Amaris",
    descripcion: "Lugar ideal para celebrar tus eventos: reuniones, fiestas y momentos especiales.",
    logo: logoSalon,
    instagramHandle: "saloneventosma",
    sedes: ["vup"],
  },
  {
    id: "frens-burger",
    nombre: "Frens Burger",
    descripcion: "Las mejores hamburguesas de Valledupar, sabor y buena atención.",
    logo: logoFrens,
    instagramHandle: "frensburgers.vup",
    sedes: ["vup"],
  },
  {
    id: "vv-accesorios",
    nombre: "V&V Accesorios",
    descripcion:
      "Celulares, accesorios y todo lo relacionado con tecnología para equipar tu día a día.",
    logo: logoVV,
    instagramHandle: "vv_accesorios",
    sedes: ["vup"],
  },
  {
    id: "andariego",
    nombre: "Andariego",
    descripcion:
      "Comida mexicana y cocina oculta: sabores auténticos para compartir en Valledupar.",
    logo: logoAndariego,
    instagramHandle: "andariegomxco",
    sedes: ["vup"],
  },
  {
    id: "donde-varo",
    nombre: "Donde Varo",
    descripcion:
      "Comidas rápidas y las mejores salchipapas de Valledupar, calidad y buen ambiente.",
    logo: logoDondeVaro,
    instagramHandle: "dondevaro",
    sedes: ["vup"],
  },
];
