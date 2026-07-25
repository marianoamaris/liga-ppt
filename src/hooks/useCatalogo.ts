import { useEffect, useMemo, useState } from "react";
import { edicionesApi, jugadoresApi } from "../lib/api";
import {
  finalAHistorica,
  jugadorAUsuarioLiga,
  type Edicion,
  type EdicionEquipo,
  type EdicionFinal,
  type EquipoConPlantilla,
  type EquipoLocal,
  type FinalHistorica,
  type Jugador,
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

/** Catálogo de ediciones, de la más reciente a la más antigua. */
export function useEdiciones() {
  const { datos, loading, error } = useAsync<Edicion[]>(
    () => edicionesApi.list().then((r) => r.ediciones),
    [],
    []
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

/** Finales de todas las ediciones, de la más reciente a la más antigua. */
export function useFinales() {
  const { datos, loading, error } = useAsync<EdicionFinal[]>(
    () => edicionesApi.finales().then((r) => r.finales),
    [],
    []
  );

  /** Misma forma que el antiguo `FINALES_HISTORICAS`, en orden ascendente. */
  const finales: FinalHistorica[] = useMemo(
    () => [...datos].sort((a, b) => a.edicion - b.edicion).map(finalAHistorica),
    [datos]
  );

  return { finales, loading, error };
}

/** Equipos de una edición, con sus colores y camisetas. */
export function useEquiposEdicion(numero: number | null) {
  const { datos, loading, error } = useAsync<EdicionEquipo[]>(
    () => (numero == null ? Promise.resolve([]) : edicionesApi.equipos(numero).then((r) => r.equipos)),
    [],
    [numero]
  );

  /** slug de equipo → color, reemplazo directo de TEAM_COLORS. */
  const colores = useMemo(() => {
    const mapa = new Map<string, string | [string, string]>();
    for (const e of datos) {
      if (!e.color_hex) continue;
      mapa.set(e.slug, e.color_hex_2 ? [e.color_hex, e.color_hex_2] : e.color_hex);
    }
    return mapa;
  }, [datos]);

  /** Forma que consumen las vistas de partido, con la camiseta ya resuelta. */
  const locales: EquipoLocal[] = useMemo(
    () =>
      datos.map((e) => ({
        id: e.slug,
        nombre: e.nombre,
        imagen: (numero != null && camisetaEquipo(numero, e.color_slug)) || "",
      })),
    [datos, numero]
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

  return { equipos: datos, locales, porId, colores, colorDe, loading, error };
}

/** Equipos de una edición junto con sus plantillas. */
export function usePlantillasEdicion(numero: number | null) {
  const { datos, loading, error } = useAsync<EquipoConPlantilla[]>(
    () =>
      numero == null
        ? Promise.resolve([])
        : edicionesApi.plantillas(numero).then((r) => r.equipos),
    [],
    [numero]
  );
  return { equipos: datos, loading, error };
}
