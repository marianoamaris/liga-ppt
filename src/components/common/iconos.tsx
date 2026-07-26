import React from "react";
import { FaFutbol, FaHandshake, FaTrophy } from "react-icons/fa6";
import { GiSoccerKick, GiWhistle, GiGoalKeeper } from "react-icons/gi";
import { LuTimer, LuTarget, LuPencil, LuFlame } from "react-icons/lu";

/**
 * Iconografía del dominio.
 *
 * Centralizada aquí para que los eventos y las fases se dibujen igual en todas
 * las pantallas, en lugar de repartir emojis por el JSX. Los emojis además se
 * ven distintos en cada sistema operativo y no heredan el color del texto.
 */

type Props = { className?: string };

export const IconoGol: React.FC<Props> = ({ className = "" }) => (
  <FaFutbol aria-hidden className={className} />
);

/** El balón entra en propia puerta: portería, no gol a favor. */
export const IconoAutogol: React.FC<Props> = ({ className = "" }) => (
  <GiGoalKeeper aria-hidden className={className} />
);

export const IconoEmpate: React.FC<Props> = ({ className = "" }) => (
  <FaHandshake aria-hidden className={className} />
);

export const IconoArquero: React.FC<Props> = ({ className = "" }) => (
  <GiGoalKeeper aria-hidden className={className} />
);

export const IconoJornada: React.FC<Props> = ({ className = "" }) => (
  <GiSoccerKick aria-hidden className={className} />
);

export const IconoCuartos: React.FC<Props> = ({ className = "" }) => (
  <LuTarget aria-hidden className={className} />
);

export const IconoSemifinal: React.FC<Props> = ({ className = "" }) => (
  <GiWhistle aria-hidden className={className} />
);

export const IconoFinal: React.FC<Props> = ({ className = "" }) => (
  <FaTrophy aria-hidden className={className} />
);

export const IconoAnotador: React.FC<Props> = ({ className = "" }) => (
  <LuPencil aria-hidden className={className} />
);

export const IconoRapido: React.FC<Props> = ({ className = "" }) => (
  <LuTimer aria-hidden className={className} />
);

export const IconoSalvador: React.FC<Props> = ({ className = "" }) => (
  <LuFlame aria-hidden className={className} />
);

/**
 * Tarjeta de amonestación. Es una tarjeta de verdad —rectángulo vertical con
 * las esquinas redondeadas— y no un cuadrado de emoji, así que se distingue de
 * un simple punto de color y respeta el tamaño del texto que la rodea.
 */
export const Tarjeta: React.FC<{ tipo: "amarilla" | "roja"; className?: string }> = ({
  tipo,
  className = "",
}) => (
  <span
    role="img"
    aria-label={tipo === "roja" ? "Tarjeta roja" : "Tarjeta amarilla"}
    className={`inline-block h-[0.95em] w-[0.68em] shrink-0 rounded-[0.1em] align-[-0.1em] ${
      tipo === "roja" ? "bg-roja" : "bg-amarilla"
    } ${className}`}
  />
);

/** Posición en un podio: número, no medalla. Las cifras se comparan mejor. */
export const Puesto: React.FC<{ n: number; className?: string }> = ({
  n,
  className = "",
}) => (
  <span
    className={`tnum font-data inline-grid size-5 shrink-0 place-items-center rounded-full text-[0.625rem] font-bold ${
      n === 1
        ? "bg-chalk text-ink"
        : n <= 3
          ? "bg-raised text-chalk"
          : "text-chalk-3"
    } ${className}`}
  >
    {n}
  </span>
);

export const ICONO_MODO: Record<string, React.FC<Props>> = {
  jornada: IconoJornada,
  cuartos: IconoCuartos,
  semifinal: IconoSemifinal,
  final: IconoFinal,
};
