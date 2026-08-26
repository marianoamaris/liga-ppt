import type { Sede } from "../types/jugador";

/**
 * Cómo se nombra una edición en pantalla.
 *
 * Desde que la liga se juega en más de una ciudad, `numero` (la clave interna
 * con la que se consulta la API) dejó de servir para mostrar: la edición 101 es
 * la primera de Bogotá y nadie la llama así. Lo que se muestra siempre es
 * `numero_sede`, y la sede al lado cuando hay ambigüedad.
 */

/** Lo mínimo que hace falta para nombrar una edición. */
export interface RefEdicion {
  sede_id: string | null;
  numero_sede: number | null;
}

/** Sigla corta de la sede para chips y espacios estrechos: "bog" → "BOG". */
export function siglaSede(sedeId: string | null | undefined): string {
  return (sedeId ?? "").toUpperCase();
}

export function nombreSede(
  sedeId: string | null | undefined,
  sedes: Sede[]
): string {
  return sedes.find((s) => s.id === sedeId)?.nombre ?? siglaSede(sedeId);
}

/**
 * "Edición 1 · Bogotá", o "Edición 20" cuando no hay con qué confundirla.
 *
 * `conSede` debe ir en true en las vistas que mezclan ciudades (el histórico de
 * finales, los títulos por jugador) y puede ir en false dentro de una vista que
 * ya está acotada a una sede, donde repetirla sería ruido.
 */
export function etiquetaEdicion(
  ref: RefEdicion,
  sedes: Sede[],
  opciones: { conSede?: boolean } = {}
): string {
  const numero = ref.numero_sede ?? "—";
  if (!opciones.conSede || !ref.sede_id) return `Edición ${numero}`;
  return `Edición ${numero} · ${nombreSede(ref.sede_id, sedes)}`;
}

/**
 * Si conviene mostrar la sede: solo cuando el conjunto que se está pintando
 * mezcla más de una. Evita estampar «Valledupar» en cada fila de un histórico
 * que, por ahora, es todo de Valledupar.
 */
export function mezclaSedes(refs: { sede_id: string | null }[]): boolean {
  const vistas = new Set(refs.map((r) => r.sede_id).filter(Boolean));
  return vistas.size > 1;
}
