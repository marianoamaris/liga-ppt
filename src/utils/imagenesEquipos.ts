/**
 * Resuelve la camiseta de un equipo a partir de su color.
 *
 * Los archivos viven en `src/assets/LIGA_<n>/<Color>.png` y el nombre del color
 * es lo que la base guarda en `edicion_equipos.color_slug`.
 */

const modules = import.meta.glob<string>(
  "../assets/LIGA_*/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

/** "../assets/LIGA_20/Amarillo.png" → clave "20/amarillo" */
function claveDeRuta(ruta: string): string | null {
  const m = ruta.match(/LIGA_(\d+)\/([^/]+)\.[^.]+$/i);
  if (!m) return null;
  return `${m[1]}/${m[2].toLowerCase()}`;
}

const porClave = new Map<string, string>();
for (const [ruta, url] of Object.entries(modules)) {
  const clave = claveDeRuta(ruta);
  if (clave && !porClave.has(clave)) porClave.set(clave, url);
}

/** URL de la camiseta, o null si esa edición no tiene imagen para ese color. */
export function camisetaEquipo(
  edicion: number,
  colorSlug: string | null | undefined
): string | null {
  if (!colorSlug) return null;
  return porClave.get(`${edicion}/${colorSlug.toLowerCase()}`) ?? null;
}
