import { useEffect, useMemo, useRef } from "react";
import type { Arquero, Goleador, Partido, Standing } from "../lib/api";
import { guardado, useConsulta } from "../lib/cache";
import { consultas, invalidarDerivados } from "../lib/consultas";
import { useSede } from "../context/SedeContext";
import { useEdiciones, useFinales, useJugadores } from "./useCatalogo";

/**
 * Cada cuánto se mira si hay partido. Preguntar por el directo es barato —una
 * consulta a partidos sin terminar—, así que esto sigue corriendo siempre; lo
 * caro, la tabla y los rankings, solo se sondea mientras se juega.
 */
const REFRESCO_CON_PARTIDO_MS = 15_000;
const REFRESCO_SIN_PARTIDO_MS = 60_000;

interface EstadoInicio {
  enVivo: Partido[];
  standings: Standing[];
  goleadores: Goleador[];
  arqueros: Arquero[];
  loading: boolean;
  error: string | null;
}

const SIN_PARTIDOS: Partido[] = [];
const SIN_FILAS: never[] = [];

/**
 * Datos de la edición en curso para el Inicio.
 *
 * Antes pedía el directo, la tabla, los goleadores y los arqueros cada quince
 * segundos a cualquier hora, aunque fuera martes y no se jugara nada. Ahora la
 * tabla y los rankings salen de la caché —los mismos que usa En Vivo— y solo
 * se sondean con partido en curso.
 */
function useEdicionEnCurso(edicion: number | null): EstadoInicio {
  // El intervalo depende de lo que devuelve la propia consulta: en cuanto
  // aparece un partido, se pasa a mirar cada quince segundos. Se lee de la
  // caché en el render, que es lo mismo que va a devolver `useConsulta`.
  const consultaDirecto = edicion == null ? null : consultas.enVivo(edicion);
  const vivo = !!consultaDirecto && (guardado<Partido[]>(consultaDirecto.clave)?.length ?? 0) > 0;
  const directo = useConsulta(consultaDirecto, {
    refrescoMs: vivo ? REFRESCO_CON_PARTIDO_MS : REFRESCO_SIN_PARTIDO_MS,
  });
  const enVivo = directo.datos ?? SIN_PARTIDOS;

  const refresco = { refrescoMs: vivo ? REFRESCO_CON_PARTIDO_MS : undefined };
  const tabla = useConsulta(edicion == null ? null : consultas.clasificacion(edicion, vivo), refresco);
  const gol = useConsulta(edicion == null ? null : consultas.goleadores(edicion, vivo), refresco);
  const arq = useConsulta(edicion == null ? null : consultas.arqueros(edicion, vivo), refresco);

  // Cuando un partido empieza o termina, lo calculado ya no vale: la tabla del
  // cierre de jornada tiene que verse sin esperar a que caduque.
  const ids = enVivo.map((p) => p.id).join(",");
  const idsPrevios = useRef<string | null>(null);
  useEffect(() => {
    if (edicion == null || directo.datos === undefined) return;
    if (idsPrevios.current != null && idsPrevios.current !== ids) invalidarDerivados(edicion);
    idsPrevios.current = ids;
  }, [edicion, ids, directo.datos]);

  return {
    enVivo,
    standings: tabla.datos ?? SIN_FILAS,
    goleadores: gol.datos ?? SIN_FILAS,
    arqueros: arq.datos ?? SIN_FILAS,
    loading: directo.loading || tabla.loading || gol.loading || arq.loading,
    error: directo.error ?? tabla.error ?? gol.error ?? arq.error,
  };
}

/** Campeón de la última edición cerrada de la sede, con el marcador de su final. */
function useCampeonVigente(sede: string) {
  const { finales } = useFinales(sede);

  return useMemo(() => {
    const cerradas = finales.filter(
      (f) => f.resultado === "1" || f.resultado === "2"
    );
    const ultima = cerradas[cerradas.length - 1];
    if (!ultima) return null;

    const gano1 = ultima.resultado === "1";
    return {
      edicion: ultima.temporada,
      campeon: gano1 ? ultima.equipo1 : ultima.equipo2,
      subcampeon: gano1 ? ultima.equipo2 : ultima.equipo1,
      golesCampeon: gano1 ? ultima.goles1 : ultima.goles2,
      golesSubcampeon: gano1 ? ultima.goles2 : ultima.goles1,
      color: gano1 ? ultima.color1 : ultima.color2,
    };
  }, [finales]);
}

/**
 * Todo lo que el Inicio necesita: lo que se juega ahora, cómo va la edición
 * y el tamaño de la liga.
 */
export function useInicio() {
  const { sedeId, edicionActual } = useSede();
  const edicion = useEdicionEnCurso(edicionActual);
  // El resumen es de la ciudad que se está mirando, no de la liga entera:
  // «20 ediciones» al lado de la clasificación de Bogotá sería engañoso.
  const { ediciones } = useEdiciones(sedeId);
  const { finales } = useFinales(sedeId);
  const { jugadores } = useJugadores({ sede: sedeId });
  const campeonVigente = useCampeonVigente(sedeId);

  /* Las canchas en juego, numeradas por orden de inicio como en En Vivo (la
     API los devuelve del más reciente al más antiguo). */
  const canchas = useMemo(
    () =>
      [...edicion.enVivo]
        .sort((a, b) => new Date(a.iniciado_en).getTime() - new Date(b.iniciado_en).getTime())
        .slice(0, 3),
    [edicion.enVivo]
  );

  const resumenLiga = useMemo(
    () => ({
      ediciones: ediciones.length,
      jugadores: jugadores.length,
      finales: finales.length,
    }),
    [ediciones.length, jugadores.length, finales.length]
  );

  return { ...edicion, canchas, campeonVigente, resumenLiga };
}
