import { useEffect, useState } from "react";
import { statsApi } from "../lib/api";

export interface TablaGeneralRow {
  equipo: string;
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
}

/** Tabla general en vivo de la Liga 19, misma fuente que /en-vivo (statsApi.clasificacion). */
export function useTablaGeneralLiga19(activo: boolean) {
  const [tablaGeneral, setTablaGeneral] = useState<TablaGeneralRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activo) return;
    let cancelado = false;
    setLoading(true);
    statsApi
      .clasificacion(19)
      .then(({ standings }) => {
        if (cancelado) return;
        setTablaGeneral(
          standings.map((s) => ({
            equipo: s.nombre,
            victorias: s.victorias,
            empates: s.empates,
            derrotas: s.derrotas,
            puntos: s.puntos,
          }))
        );
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelado) setLoading(false);
      });
    return () => {
      cancelado = true;
    };
  }, [activo]);

  return { tablaGeneral, loading };
}
