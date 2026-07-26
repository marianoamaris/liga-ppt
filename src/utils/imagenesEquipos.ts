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

/**
 * Los nueve colores de camiseta de la liga, con su valor de referencia.
 * Sirven para deducir el color de un equipo cuyo `color_slug` no se registró
 * pero del que sí conocemos el hex.
 */
const COLORES_CAMISETA: [string, [number, number, number]][] = [
  ["amarillo", [255, 214, 0]],
  ["azul", [21, 101, 192]],
  ["blanco", [245, 245, 245]],
  ["morado", [123, 31, 162]],
  ["naranja", [230, 81, 0]],
  ["negro", [33, 33, 33]],
  ["rojo", [198, 40, 40]],
  ["rosado", [233, 30, 140]],
  ["verde", [46, 125, 50]],
];

function aRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Color de camiseta más próximo a un hex, por distancia en RGB. */
export function colorCamisetaDesdeHex(hex: string | null | undefined): string | null {
  if (!hex) return null;
  const rgb = aRgb(hex);
  if (!rgb) return null;

  let mejor: string | null = null;
  let menor = Infinity;
  for (const [nombre, ref] of COLORES_CAMISETA) {
    const d =
      (rgb[0] - ref[0]) ** 2 + (rgb[1] - ref[1]) ** 2 + (rgb[2] - ref[2]) ** 2;
    if (d < menor) {
      menor = d;
      mejor = nombre;
    }
  }
  return mejor;
}

/**
 * URL de la camiseta, o null si esa edición no tiene imagen para ese color.
 *
 * Si el equipo no tiene `color_slug` registrado (pasa en las ediciones cuyos
 * equipos se derivaron de la tabla general) se deduce del hex, que sí consta.
 */
export function camisetaEquipo(
  edicion: number,
  colorSlug: string | null | undefined,
  colorHex?: string | null
): string | null {
  const color = colorSlug ?? colorCamisetaDesdeHex(colorHex);
  if (!color) return null;
  return porClave.get(`${edicion}/${color.toLowerCase()}`) ?? null;
}
