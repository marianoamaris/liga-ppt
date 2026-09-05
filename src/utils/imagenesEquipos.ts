/**
 * Resuelve la camiseta de un equipo a partir de su color.
 *
 * Los diseños se dejan caer en `src/assets/CAMISETAS/<sede>/<n>/<Color>.png`,
 * donde `n` es el número de la edición **dentro de su sede** —el que ve el
 * usuario— y no la clave interna: así la primera edición de Bogotá es `bog/1`
 * y no `101`, que no le diría nada a quien suba los diseños nuevos.
 *
 * Lo que se lee aquí, en cambio, es la carpeta derivada: los originales son
 * PNG de 1620 px y hasta 2,3 MB para un recuadro de 400, y el carrusel los
 * precargaba todos. Las genera `scripts/optimizar-camisetas.mjs`.
 *
 * El nombre del color es lo que la base guarda en `edicion_equipos.color_slug`.
 */

const modules = import.meta.glob<string>(
  "../assets/CAMISETAS_MIN/*/*/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

/** "../assets/CAMISETAS_MIN/vup/20/Amarillo.webp" → clave "vup/20/amarillo" */
function claveDeRuta(ruta: string): string | null {
  const m = ruta.match(/CAMISETAS_MIN\/([^/]+)\/(\d+)\/([^/]+)\.[^.]+$/i);
  if (!m) return null;
  return `${m[1].toLowerCase()}/${m[2]}/${m[3].toLowerCase()}`;
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
 * `numeroSede` es el número visible de la edición, no `ediciones.numero`.
 *
 * Si el equipo no tiene `color_slug` registrado (pasa en las ediciones cuyos
 * equipos se derivaron de la tabla general) se deduce del hex, que sí consta.
 */
export function camisetaEquipo(
  sede: string | null | undefined,
  numeroSede: number | null | undefined,
  colorSlug: string | null | undefined,
  colorHex?: string | null
): string | null {
  if (!sede || numeroSede == null) return null;
  const color = colorSlug ?? colorCamisetaDesdeHex(colorHex);
  if (!color) return null;
  return porClave.get(`${sede.toLowerCase()}/${numeroSede}/${color.toLowerCase()}`) ?? null;
}
