import { useEffect, useState } from "react";
import { DURACION_POR_MODO, formatCountdown, transcurridoDe } from "../anotador/utils";
import type { EstadoReloj, ModoPartido } from "../anotador/types";

interface Props {
  reloj: EstadoReloj;
  modo: string;
  /** Tamaño de los dígitos; el Inicio lo lleva en la cabecera, más pequeño. */
  className?: string;
}

/**
 * El cronómetro del anotador, tal como lo ve él: cuenta atrás.
 *
 * Del partido llega solo el estado —acumulado y desde cuándo corre—, que se
 * escribe al arrancar, parar o reiniciar. El segundo en curso se calcula aquí,
 * y solo se repinta mientras corre: un reloj parado no programa nada.
 */
export function RelojPartido({ reloj, modo, className = "text-xl" }: Props) {
  const duracion = DURACION_POR_MODO[modo as ModoPartido] ?? DURACION_POR_MODO.jornada;
  const restante = Math.max(0, duracion - transcurridoDe(reloj, duracion));
  const corriendo = reloj.desde != null && restante > 0;
  const [, tick] = useState(0);

  useEffect(() => {
    if (!corriendo) return;
    const i = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(i);
  }, [corriendo]);

  const agotado = restante === 0;
  const urgente = !agotado && restante <= 60;
  return (
    <span className="inline-flex items-center gap-2">
      {!corriendo && !agotado && (
        <span className="text-chalk-3 text-[10px] uppercase tracking-wider font-semibold">
          {reloj.acumulado === 0 ? "Sin arrancar" : "En pausa"}
        </span>
      )}
      <span
        className={`font-mono font-black tnum leading-none ${className} ${
          agotado ? "text-red-400" : urgente ? "text-yellow-400" : "text-chalk"
        }`}
      >
        {agotado ? "Tiempo" : formatCountdown(restante)}
      </span>
    </span>
  );
}
