import { useMemo } from "react";
import { useConsulta, type Consulta } from "../lib/cache";
import { consultas } from "../lib/consultas";
import type { AnalisisEdicion, PerfilJugador } from "../types/analisis";
import {
  finalAHistorica,
  jugadorAUsuarioLiga,
  type Edicion,
  type EdicionEquipo,
  type EdicionFinal,
  type EquipoConPlantilla,
  type EquipoLocal,
  type FinalHistorica,
  type FilaPalmares,
  type HistoricoEdicion,
  type Jugador,
  type JugadorTitulos,
  type TipoPalmares,
  type FilaRecord,
  type TipoRecord,
  type UsuarioLiga,
} from "../types/jugador";
import { camisetaEquipo } from "../utils/imagenesEquipos";

/**
 * Una consulta de la caché con un valor por defecto mientras no hay datos.
 *
 * `inicial` tiene que ser estable (una constante de módulo): se devuelve tal
 * cual mientras carga, y un objeto nuevo en cada render haría recalcular todo
 * lo que dependa de él.
 */
function useLectura<T>(consulta: Consulta<T> | null, inicial: T) {
  const { datos, loading, error } = useConsulta(consulta);
  return { datos: datos ?? inicial, loading, error };
}

const SIN_FILAS: never[] = [];
const SIN_GRUPOS = {} as Record<string, never[]>;

/**
 * Padrón de jugadores. Por defecto solo los activos y de identidad confirmada.
 *
 * Con `sede` se limita a quienes juegan en esa ciudad; sin ella devuelve el
 * padrón entero, que es único para toda la liga. Quien juegue en dos ciudades
 * aparece en ambas.
 */
export function useJugadores(
  opciones: { incluirInciertos?: boolean; sede?: string } = {}
) {
  const { incluirInciertos = false, sede } = opciones;
  const { datos, loading, error } = useLectura<Jugador[]>(
    consultas.jugadores({ incluirInciertos, sede }),
    SIN_FILAS
  );

  /** Misma forma que el antiguo `USUARIOS_LIGA`, para las vistas aún sin migrar. */
  const usuarios: UsuarioLiga[] = useMemo(
    () => datos.map(jugadorAUsuarioLiga),
    [datos]
  );

  /**
   * Búsqueda por username, que es como las vistas de récords y los carruseles
   * referencian a un jugador. Devuelve undefined mientras el padrón carga.
   */
  const porUsername = useMemo(() => {
    const mapa = new Map<string, UsuarioLiga>();
    for (const u of usuarios) mapa.set(u.username, u);
    return mapa;
  }, [usuarios]);

  const buscarPorUsername = useMemo(
    () => (username: string) => porUsername.get(username),
    [porUsername]
  );

  return { jugadores: datos, usuarios, buscarPorUsername, loading, error };
}

/**
 * Catálogo de ediciones, de la más reciente a la más antigua.
 *
 * Con `sede` se acota a una ciudad —lo que necesita un selector de edición, que
 * de otro modo mezclaría dos «Edición 1»—; sin ella devuelve toda la historia
 * de la liga, que es lo que muestran las vistas de récords.
 */
export function useEdiciones(sede?: string) {
  const { datos, loading, error } = useLectura<Edicion[]>(consultas.ediciones(sede), SIN_FILAS);
  return { ediciones: datos, loading, error };
}

/** Una edición concreta con sus equipos y su final. */
const SIN_EDICION: { edicion: Edicion | null; equipos: EdicionEquipo[]; final: EdicionFinal | null } =
  { edicion: null, equipos: [], final: null };

export function useEdicion(numero: number | null) {
  const { datos, loading, error } = useLectura(
    numero == null ? null : consultas.edicion(numero),
    SIN_EDICION
  );

  return { ...datos, loading, error };
}

/**
 * Finales de todas las ediciones, de la más reciente a la más antigua.
 * Con `sede` se limita a una ciudad.
 */
export function useFinales(sede?: string) {
  const { datos, loading, error } = useLectura<EdicionFinal[]>(consultas.finales(sede), SIN_FILAS);

  /** Misma forma que el antiguo `FINALES_HISTORICAS`, en orden ascendente. */
  const finales: FinalHistorica[] = useMemo(
    () => [...datos].sort((a, b) => a.edicion - b.edicion).map(finalAHistorica),
    [datos]
  );

  return { finales, loading, error };
}

/**
 * Edición completa. El backend decide si la sirve desde los agregados
 * históricos o derivándola de los partidos, y lo indica en `origen`.
 */
export function useHistoricoEdicion(numero: number | null) {
  const { datos, loading, error } = useLectura<HistoricoEdicion | null>(
    numero == null ? null : consultas.historico(numero),
    null
  );
  return { historico: datos, loading, error };
}

/** Palmarés histórico de una sede, agrupado por tipo de récord. */
export function usePalmares(sede?: string) {
  const { datos, loading, error } = useLectura<Record<TipoPalmares, FilaPalmares[]>>(
    consultas.palmares(sede),
    SIN_GRUPOS
  );

  const de = useMemo(
    () => (tipo: TipoPalmares): FilaPalmares[] => datos[tipo] ?? [],
    [datos]
  );

  return { palmares: datos, de, loading, error };
}

/** Jugadores con títulos de una sede, con el detalle de las ediciones que ganaron. */
export function useTitulos(sede?: string) {
  const { datos, loading, error } = useLectura<JugadorTitulos[]>(consultas.titulos(sede), SIN_FILAS);
  return { titulos: datos, loading, error };
}

/** Récords históricos de una sede, agrupados por tipo. */
export function useRecords(sede?: string) {
  const { datos, loading, error } = useLectura<Record<TipoRecord, FilaRecord[]>>(
    consultas.records(sede),
    SIN_GRUPOS
  );

  const de = useMemo(
    () => (tipo: TipoRecord): FilaRecord[] => datos[tipo] ?? [],
    [datos]
  );

  return { records: datos, de, loading, error };
}

/** Equipos de una edición, con sus colores y camisetas. */
const SIN_EQUIPOS: { equipos: EdicionEquipo[]; sede_id: string | null; numero_sede: number | null } =
  { equipos: [], sede_id: null, numero_sede: null };

export function useEquiposEdicion(numero: number | null) {
  const { datos, loading, error } = useLectura(
    numero == null ? null : consultas.equipos(numero),
    SIN_EQUIPOS
  );

  const { equipos: filas, sede_id, numero_sede } = datos;

  /** slug de equipo → color, reemplazo directo de TEAM_COLORS. */
  const colores = useMemo(() => {
    const mapa = new Map<string, string | [string, string]>();
    for (const e of filas) {
      if (!e.color_hex) continue;
      mapa.set(e.slug, e.color_hex_2 ? [e.color_hex, e.color_hex_2] : e.color_hex);
    }
    return mapa;
  }, [filas]);

  /** Forma que consumen las vistas de partido, con la camiseta ya resuelta. */
  const locales: EquipoLocal[] = useMemo(
    () =>
      filas.map((e) => ({
        id: e.slug,
        nombre: e.nombre,
        imagen: camisetaEquipo(sede_id, numero_sede, e.color_slug, e.color_hex) ?? "",
      })),
    [filas, sede_id, numero_sede]
  );

  const porId = useMemo(() => {
    const mapa = new Map<string, EquipoLocal>();
    for (const e of locales) mapa.set(e.id, e);
    return mapa;
  }, [locales]);

  /** Color de un equipo; gris neutro si no está cargado todavía. */
  const colorDe = useMemo(
    () => (id: string) => {
      const c = colores.get(id);
      return (Array.isArray(c) ? c[0] : c) ?? "#4B5563";
    },
    [colores]
  );

  return { equipos: filas, locales, porId, colores, colorDe, sede_id, numero_sede, loading, error };
}

/**
 * Equipos de una edición junto con sus plantillas.
 *
 * Devuelve la sede y el número visible porque las camisetas se guardan por sede
 * y edición, y `numero` a secas ya no basta para encontrarlas. Devuelve además
 * `edicion`: mientras carga una edición nueva, `equipos` sigue conteniendo los
 * de la anterior, y quien pinte estos datos necesita poder distinguirlo.
 */
const SIN_PLANTILLAS = {
  equipos: [] as EquipoConPlantilla[],
  edicion: null as number | null,
  sede_id: null as string | null,
  numero_sede: null as number | null,
};

export function usePlantillasEdicion(numero: number | null) {
  const { datos, loading, error } = useLectura(
    numero == null ? null : consultas.plantillas(numero),
    SIN_PLANTILLAS
  );

  const { equipos, edicion, sede_id, numero_sede } = datos;
  return { equipos, edicion, sede_id, numero_sede, loading, error };
}

/**
 * Resumen de jornadas, evolución, forma, rachas y estadísticas
 * por jugador de una edición. Las ediciones heredadas llegan vacías.
 */
export function useAnalisis(numero: number | null) {
  const { datos, loading, error } = useLectura<AnalisisEdicion | null>(
    numero == null ? null : consultas.analisis(numero),
    null
  );
  return { analisis: datos, loading, error };
}

/** Perfil completo de un jugador. Acepta el slug canónico o un alias. */
export function usePerfilJugador(slug: string | undefined) {
  const { datos, loading, error } = useLectura<PerfilJugador | null>(
    slug ? consultas.perfil(slug) : null,
    null
  );
  return { perfil: datos, loading, error };
}
