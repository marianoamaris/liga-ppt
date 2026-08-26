import { useEffect, useMemo, useState } from "react";
import {
  partidosApi,
  statsApi,
  type Arquero,
  type Goleador,
  type Partido,
  type Standing,
} from "../lib/api";
import { useSede } from "../context/SedeContext";
import { useEdiciones, useFinales, useJugadores } from "./useCatalogo";

/** Cada cuánto se refresca el marcador del Inicio. */
const REFRESCO_MS = 15_000;

interface EstadoInicio {
  enVivo: Partido[];
  standings: Standing[];
  goleadores: Goleador[];
  arqueros: Arquero[];
  loading: boolean;
  error: string | null;
}

/**
 * Datos de la edición en curso para el Inicio. Refresca en segundo plano
 * mientras hay partidos abiertos, para que el marcador no se quede viejo.
 */
function useEdicionEnCurso(edicion: number | null): EstadoInicio {
  const [estado, setEstado] = useState<EstadoInicio>({
    enVivo: [],
    standings: [],
    goleadores: [],
    arqueros: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelado = false;

    // Sin edición en curso no hay nada que pedir. `loading` se apaga igual: si
    // esta ciudad no tiene liga abierta, quedarse cargando para siempre haría
    // parecer que la petición nunca vuelve.
    if (edicion == null) {
      setEstado({
        enVivo: [],
        standings: [],
        goleadores: [],
        arqueros: [],
        loading: false,
        error: null,
      });
      return;
    }

    async function cargar(numero: number) {
      try {
        const [vivo, clasif, gol, arq] = await Promise.all([
          partidosApi.getEnVivo(numero),
          statsApi.clasificacion(numero),
          statsApi.goleadores(numero),
          statsApi.arqueros(numero),
        ]);
        if (cancelado) return;
        setEstado({
          enVivo: vivo.enVivo,
          standings: clasif.standings,
          goleadores: gol.goleadores,
          arqueros: arq.arqueros,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (cancelado) return;
        setEstado((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : "No se pudieron cargar los datos",
        }));
      }
    }

    cargar(edicion);
    const id = setInterval(() => cargar(edicion), REFRESCO_MS);
    return () => {
      cancelado = true;
      clearInterval(id);
    };
  }, [edicion]);

  return estado;
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
  const { jugadores } = useJugadores();
  const campeonVigente = useCampeonVigente(sedeId);

  /* El partido a destacar: el que lleva más tiempo abierto (la API los
     devuelve del más reciente al más antiguo). */
  const partidoDestacado = edicion.enVivo[edicion.enVivo.length - 1] ?? null;

  const resumenLiga = useMemo(
    () => ({
      ediciones: ediciones.length,
      jugadores: jugadores.length,
      finales: finales.length,
    }),
    [ediciones.length, jugadores.length, finales.length]
  );

  return { ...edicion, partidoDestacado, campeonVigente, resumenLiga };
}
