import { useEffect, useState } from "react";
import { computeScores, formatElapsed } from "../anotador/utils";
import type { Partido } from "../../lib/api";
import type { EquipoLocal } from "../../types/jugador";

const MODO_LABEL: Record<string, string> = {
  jornada: "Jornada",
  cuartos: "Cuartos de final",
  semifinal: "Semifinal",
  final: "Final",
};

/** Segundos transcurridos desde el inicio, refrescados cada segundo. */
function useCronometro(desde: string) {
  const [segundos, setSegundos] = useState(() =>
    Math.max(0, Math.floor((Date.now() - new Date(desde).getTime()) / 1000))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSegundos(
        Math.max(0, Math.floor((Date.now() - new Date(desde).getTime()) / 1000))
      );
    }, 1000);
    return () => clearInterval(id);
  }, [desde]);

  return segundos;
}

interface Props {
  partido: Partido;
  catalogo: EquipoLocal[];
  colorDe: (id: string) => string;
  /** El Inicio lo muestra a ancho completo; en móvil se apila. */
  compacto?: boolean;
}

/**
 * Marcador del partido en curso. En modo jornada juegan tres equipos y lo que
 * cuenta son los puntos; en playoffs son dos y cuenta el marcador.
 */
export function Marcador({ partido, catalogo, colorDe, compacto = false }: Props) {
  const segundos = useCronometro(partido.iniciado_en);

  const equipos = partido.equipos.map((eq) => {
    const local = catalogo.find((e) => e.id === eq.equipo.id);
    return {
      equipo: local ?? { id: eq.equipo.id, nombre: eq.equipo.nombre, imagen: "" },
      jugadores: eq.jugadores,
      arqueroDesignado: eq.arqueroDesignado,
    };
  });

  const scores = computeScores(equipos, partido.eventos);
  const esJornada = partido.modo === "jornada";

  const cabecera = (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <span className="font-cond flex items-center gap-2 text-xs text-chalk-2">
        <span className="inline-block size-1.5 shrink-0 animate-pulse rounded-full bg-vivo" />
        {MODO_LABEL[partido.modo] ?? partido.modo}
        {partido.jornada ? ` ${partido.jornada}` : ""}
      </span>
      <span className="tnum font-data text-xs text-chalk-3">
        {formatElapsed(segundos)}
      </span>
    </div>
  );

  if (esJornada) {
    return (
      <div>
        {cabecera}
        <div className="flex justify-around gap-3">
          {equipos.map((eq) => {
            const s = scores.get(eq.equipo.id);
            return (
              <div key={eq.equipo.id} className="min-w-0 flex-1 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
                    style={{ backgroundColor: colorDe(eq.equipo.id) }}
                  />
                  <span className="font-cond truncate text-sm text-chalk">
                    {eq.equipo.nombre}
                  </span>
                </div>
                <div
                  className={`tnum font-data mt-1 font-bold leading-none tracking-tight text-chalk ${
                    compacto ? "text-3xl" : "text-4xl"
                  }`}
                >
                  {s?.puntos ?? 0}
                </div>
                <div className="tnum font-data mt-1 text-[0.6875rem] text-chalk-3">
                  {s?.victorias ?? 0}V {s?.empates ?? 0}E {s?.derrotas ?? 0}D
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const [a, b] = equipos;
  const golesA = scores.get(a.equipo.id)?.victorias ?? 0;
  const golesB = scores.get(b.equipo.id)?.victorias ?? 0;

  return (
    <div>
      {cabecera}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
            style={{ backgroundColor: colorDe(a.equipo.id) }}
          />
          <span className="font-cond truncate text-base text-chalk">
            {a.equipo.nombre}
          </span>
        </div>
        <div className="tnum font-data flex shrink-0 items-center gap-2 text-4xl font-bold leading-none tracking-tighter text-chalk">
          {golesA}
          <span className="text-xl font-normal text-chalk-3">–</span>
          {golesB}
        </div>
        <div className="flex min-w-0 flex-row-reverse items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
            style={{ backgroundColor: colorDe(b.equipo.id) }}
          />
          <span className="font-cond truncate text-base text-chalk">
            {b.equipo.nombre}
          </span>
        </div>
      </div>
    </div>
  );
}
