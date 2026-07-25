import { useEffect, useMemo, useState } from "react";
import { edicionesApi, jugadoresApi } from "../lib/api";
import {
  jugadorAUsuarioLiga,
  type Edicion,
  type EdicionEquipo,
  type EquipoConPlantilla,
  type Jugador,
  type UsuarioLiga,
} from "../types/jugador";

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

  return { jugadores: datos, usuarios, loading, error };
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

/** Equipos de una edición, con sus colores. */
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

  return { equipos: datos, colores, loading, error };
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
