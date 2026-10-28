import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Caché de lecturas compartida por toda la app.
 *
 * Antes cada pantalla guardaba lo que pedía en su propio estado y lo tiraba al
 * desmontarse: ir a Historia y volver a Inicio repetía las mismas peticiones y
 * enseñaba otra vez «Cargando…» por datos que se habían pedido hacía diez
 * segundos. Inicio y En Vivo, además, pedían cada uno por su lado la misma
 * clasificación y los mismos goleadores.
 *
 * Aquí cada lectura tiene una clave y una frescura:
 *
 *   - Si lo guardado está fresco, se usa sin tocar la red.
 *   - Si está viejo, se pinta igual y se refresca por detrás: la pantalla nunca
 *     vuelve a quedarse en blanco por algo que ya se vio.
 *   - Si dos componentes piden lo mismo a la vez, comparten la petición.
 *   - Si una petición falla, se conserva lo último que llegó bien.
 *
 * Es memoria de la pestaña. Recargar la página empieza de cero, y está bien: la
 * caché HTTP del navegador cubre ese caso con sus propias cabeceras.
 */

export interface Consulta<T> {
  clave: string;
  pedir: () => Promise<T>;
  /** Cuánto se da por bueno lo guardado antes de volver a pedirlo. */
  frescoMs: number;
}

interface Entrada {
  datos: unknown;
  tieneDatos: boolean;
  error: string | null;
  guardado: number;
  enVuelo: Promise<unknown> | null;
  /** La última consulta que la pidió, para poder repetirla al invalidar. */
  consulta: Consulta<unknown> | null;
}

const VACIA: Entrada = {
  datos: undefined,
  tieneDatos: false,
  error: null,
  guardado: 0,
  enVuelo: null,
  consulta: null,
};

const entradas = new Map<string, Entrada>();
const oyentes = new Map<string, Set<() => void>>();

function publicar(clave: string, cambios: Partial<Entrada>) {
  // Siempre un objeto nuevo: `useSyncExternalStore` compara por referencia.
  entradas.set(clave, { ...(entradas.get(clave) ?? VACIA), ...cambios });
  oyentes.get(clave)?.forEach((avisar) => avisar());
}

function mensaje(e: unknown): string {
  return e instanceof Error ? e.message : "Error al cargar datos";
}

function fresca(e: Entrada | undefined, frescoMs: number): boolean {
  return !!e?.tieneDatos && Date.now() - e.guardado < frescoMs;
}

/**
 * Devuelve el dato de la caché si está fresco y, si no, lo pide (una sola vez
 * aunque lo pidan varios). `forzar` ignora la frescura: es para el sondeo.
 */
export function leer<T>(c: Consulta<T>, { forzar = false } = {}): Promise<T> {
  const e = entradas.get(c.clave);
  if (e?.enVuelo) return e.enVuelo as Promise<T>;
  if (!forzar && fresca(e, c.frescoMs)) return Promise.resolve(e!.datos as T);

  const promesa = c.pedir().then(
    (datos) => {
      publicar(c.clave, {
        datos,
        tieneDatos: true,
        error: null,
        guardado: Date.now(),
        enVuelo: null,
      });
      return datos;
    },
    (err: unknown) => {
      publicar(c.clave, { error: mensaje(err), enVuelo: null });
      throw err;
    }
  );
  publicar(c.clave, { enVuelo: promesa, consulta: c as Consulta<unknown> });
  return promesa;
}

/** Lo que haya guardado para una clave, sin pedir nada. */
export function guardado<T>(clave: string): T | undefined {
  return entradas.get(clave)?.datos as T | undefined;
}

/**
 * Reescribe un dato guardado sin ir a la red. Es para lo que llega por otra
 * vía —un aviso de Realtime trae la fila entera— y tiene que verse en todas las
 * pantallas que miran esa clave.
 */
export function mutar<T>(clave: string, cambiar: (actual: T | undefined) => T) {
  const actual = entradas.get(clave);
  publicar(clave, {
    datos: cambiar(actual?.datos as T | undefined),
    tieneDatos: true,
    guardado: actual?.guardado || Date.now(),
  });
}

/**
 * Da por viejas las claves que cumplan el filtro. Las que alguien está mirando
 * se piden de nuevo al momento; las demás, cuando alguien vuelva a ellas.
 */
export function invalidar(filtro: (clave: string) => boolean) {
  for (const [clave, e] of entradas) {
    if (!filtro(clave)) continue;
    entradas.set(clave, { ...e, guardado: 0 });
    if (oyentes.get(clave)?.size && e.consulta) leer(e.consulta).catch(() => {});
  }
}

/** Todo lo derivado de los partidos de una edición: tabla, rankings, directo. */
export function invalidarEdicion(numero: number) {
  invalidar((clave) => clave.endsWith(`:${numero}`));
}

function suscribir(clave: string, avisar: () => void) {
  let set = oyentes.get(clave);
  if (!set) oyentes.set(clave, (set = new Set()));
  set.add(avisar);
  return () => {
    set!.delete(avisar);
  };
}

const sinSuscripcion = () => () => {};

export interface EstadoConsulta<T> {
  datos: T | undefined;
  /** Solo es true si no hay nada que enseñar todavía. Refrescar no cuenta. */
  loading: boolean;
  error: string | null;
}

/**
 * Lee una consulta desde un componente.
 *
 * Con `null` no pide nada (p. ej. sin edición en curso). Con `refrescoMs` la
 * repite cada tanto, pero solo con la pestaña visible: un celular con la web
 * abierta en segundo plano no tiene por qué seguir gastando datos. Al volver a
 * la pestaña se refresca si lo guardado ya está viejo.
 */
export function useConsulta<T>(
  consulta: Consulta<T> | null,
  { refrescoMs }: { refrescoMs?: number } = {}
): EstadoConsulta<T> {
  const clave = consulta?.clave ?? null;
  // La consulta llega como objeto nuevo en cada render; la clave es lo que
  // identifica qué se pide.
  const ultima = useRef(consulta);
  ultima.current = consulta;

  const sub = useCallback(
    (avisar: () => void) => (clave ? suscribir(clave, avisar) : sinSuscripcion()),
    [clave]
  );
  const e = useSyncExternalStore(sub, () => (clave ? entradas.get(clave) ?? VACIA : VACIA));

  useEffect(() => {
    if (!clave) return;
    const pedir = (forzar: boolean) => {
      const c = ultima.current;
      if (c) leer(c, { forzar }).catch(() => {});
    };
    pedir(false);

    const alVolver = () => {
      if (!document.hidden) pedir(false);
    };
    document.addEventListener("visibilitychange", alVolver);

    const intervalo = refrescoMs
      ? setInterval(() => {
          if (!document.hidden) pedir(true);
        }, refrescoMs)
      : null;

    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      if (intervalo) clearInterval(intervalo);
    };
  }, [clave, refrescoMs]);

  if (!clave) return { datos: undefined, loading: false, error: null };
  return {
    datos: e.datos as T | undefined,
    loading: !e.tieneDatos && (e.enVuelo != null || e.error == null),
    error: e.tieneDatos ? null : e.error,
  };
}
