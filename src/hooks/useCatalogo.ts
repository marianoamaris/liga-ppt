import { useEffect, useMemo, useState } from "react";
import { edicionesApi, jugadoresApi, palmaresApi, recordsApi } from "../lib/api";
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

interface Estado<T> {
  datos: T;
  loading: boolean;
  error: string | null;
}

/** Ejecuta una promesa y expone su estado, cancelando si el componente se desmonta. */
function useAsync<T>(fn: () => Promise<T>, inicial: T, deps: unknown[]): Estado<T> {
  const [estado, setEstado] = useState<Estado<T>>({
    datos: inicial,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelado = false;
    setEstado((e) => ({ ...e, loading: true, error: null }));
    fn()
      .then((datos) => {
        if (!cancelado) setEstado({ datos, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (cancelado) return;
        setEstado({
          datos: inicial,
          loading: false,
          error: e instanceof Error ? e.message : "Error al cargar datos",
        });
      });
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return estado;
}

/** Padrón de jugadores. Por defecto solo los activos y de identidad confirmada. */
export function useJugadores(opciones: { incluirInciertos?: boolean } = {}) {
  const { incluirInciertos = false } = opciones;
  const { datos, loading, error } = useAsync<Jugador[]>(
    () =>
      jugadoresApi
        .list({ activo: incluirInciertos ? "todos" : "true", inciertos: incluirInciertos })
        .then((r) => r.jugadores),
    [],
    [incluirInciertos]
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
  const { datos, loading, error } = useAsync<Edicion[]>(
    () => edicionesApi.list(sede).then((r) => r.ediciones),
    [],
    [sede]
  );
  return { ediciones: datos, loading, error };
}

/** Una edición concreta con sus equipos y su final. */
export function useEdicion(numero: number | null) {
  const { datos, loading, error } = useAsync<{
    edicion: Edicion | null;
    equipos: EdicionEquipo[];
    final: EdicionFinal | null;
  }>(
    () =>
      numero == null
        ? Promise.resolve({ edicion: null, equipos: [], final: null })
        : edicionesApi.get(numero),
    { edicion: null, equipos: [], final: null },
    [numero]
  );

  return { ...datos, loading, error };
}

/**
 * Finales de todas las ediciones, de la más reciente a la más antigua.
 * Con `sede` se limita a una ciudad.
 */
export function useFinales(sede?: string) {
  const { datos, loading, error } = useAsync<EdicionFinal[]>(
    () => edicionesApi.finales(sede).then((r) => r.finales),
    [],
    [sede]
  );

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
  const { datos, loading, error } = useAsync<HistoricoEdicion | null>(
    () => (numero == null ? Promise.resolve(null) : edicionesApi.historico(numero)),
    null,
    [numero]
  );
  return { historico: datos, loading, error };
}

/** Palmarés histórico de una sede, agrupado por tipo de récord. */
export function usePalmares(sede?: string) {
  const { datos, loading, error } = useAsync<Record<TipoPalmares, FilaPalmares[]>>(
    () => palmaresApi.todo(sede).then((r) => r.palmares),
    {} as Record<TipoPalmares, FilaPalmares[]>,
    [sede]
  );

  const de = useMemo(
    () => (tipo: TipoPalmares): FilaPalmares[] => datos[tipo] ?? [],
    [datos]
  );

  return { palmares: datos, de, loading, error };
}

/** Jugadores con títulos de una sede, con el detalle de las ediciones que ganaron. */
export function useTitulos(sede?: string) {
  const { datos, loading, error } = useAsync<JugadorTitulos[]>(
    () => palmaresApi.titulos(sede).then((r) => r.titulos),
    [],
    [sede]
  );
  return { titulos: datos, loading, error };
}

/** Récords históricos de una sede, agrupados por tipo. */
export function useRecords(sede?: string) {
  const { datos, loading, error } = useAsync<Record<TipoRecord, FilaRecord[]>>(
    () => recordsApi.todo(sede).then((r) => r.records),
    {} as Record<TipoRecord, FilaRecord[]>,
    [sede]
  );

  const de = useMemo(
    () => (tipo: TipoRecord): FilaRecord[] => datos[tipo] ?? [],
    [datos]
  );

  return { records: datos, de, loading, error };
}

/** Equipos de una edición, con sus colores y camisetas. */
export function useEquiposEdicion(numero: number | null) {
  const vacio = { equipos: [] as EdicionEquipo[], sede_id: null, numero_sede: null };

  const { datos, loading, error } = useAsync<{
    equipos: EdicionEquipo[];
    sede_id: string | null;
    numero_sede: number | null;
  }>(
    () =>
      numero == null
        ? Promise.resolve(vacio)
        : edicionesApi.equipos(numero).then((r) => ({
            equipos: r.equipos,
            sede_id: r.sede_id,
            numero_sede: r.numero_sede,
          })),
    vacio,
    [numero]
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
export function usePlantillasEdicion(numero: number | null) {
  const vacio = {
    equipos: [] as EquipoConPlantilla[],
    edicion: null as number | null,
    sede_id: null as string | null,
    numero_sede: null as number | null,
  };

  const { datos, loading, error } = useAsync<typeof vacio>(
    () =>
      numero == null
        ? Promise.resolve(vacio)
        : edicionesApi.plantillas(numero).then((r) => ({
            equipos: r.equipos,
            edicion: r.edicion,
            sede_id: r.sede_id,
            numero_sede: r.numero_sede,
          })),
    vacio,
    [numero]
  );

  return { ...datos, loading, error };
}
