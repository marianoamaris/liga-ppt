/**
 * Resuelve la URL de la foto en `src/assets/FOTOS_JUGADORES/`
 * comparando el nombre del jugador con el nombre del archivo (sin extensión).
 */

const modules = import.meta.glob<string>(
  "../assets/FOTOS_JUGADORES/*.{png,jpg,jpeg,webp}",
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
