/**
 * Resuelve la URL de la foto de un jugador comparando el nombre con el del
 * archivo (sin extensión).
 *
 * Se leen las miniaturas, no los originales: estos pesan entre 3 y 6 MB cada
 * uno y se muestran en fichas de 64 px, así que la página de Historia llegaba
 * a pedir cientos de megas. Las genera `scripts/generar-miniaturas.sh`.
 */

const modules = import.meta.glob<string>(
  "../assets/FOTOS_JUGADORES_MIN/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

/** Normaliza para comparar nombre ↔ archivo */
function normKey(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Variantes de nombre en app → clave del archivo ya normalizada */
const ALIASES: Record<string, string> = {
  "juan de la cruz": "juan dlc",
  "jhan c martinez": "jhan martinez",
};

function buildStemToUrl(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(modules)) {
    const file = path.split("/").pop() ?? path;
    const base = file.replace(/\.[^.]+$/i, "");
    if (/\(\s*1\s*\)/i.test(base)) continue;
    const k = normKey(base);
    if (!map.has(k)) map.set(k, url);
  }
  return map;
}

const stemToUrl = buildStemToUrl();

export function fotoJugadorPorNombre(nombre: string): string | null {
  let k = normKey(nombre);
  k = ALIASES[k] ?? k;
  return stemToUrl.get(k) ?? null;
}

/**
 * Resuelve la foto a partir del archivo que consta en la base
 * (`jugadores.foto_archivo`), que es el dato fiable: se calculó al migrar
 * cruzando el padrón con los archivos reales, incluidos los alias.
 */
export function fotoJugadorPorArchivo(archivo: string | null): string | null {
  if (!archivo) return null;
  return stemToUrl.get(normKey(archivo.replace(/\.[^.]+$/i, ""))) ?? null;
}
