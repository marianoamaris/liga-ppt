import { useEffect, useState } from "react";

export function getEquipoStats(
  equipo: string,
  row: any,
  arquerosMap: Record<string, number>,
  arquerosEquipoMap: Record<string, string>
) {
  const victorias = row.victorias || 0;
  const empates = row.empates || 0;
  // Buscar el nombre del arquero para este equipo
  const arquero = arquerosEquipoMap[equipo];
  const derrotas =
    arquero && arquerosMap[arquero] !== undefined
      ? String(arquerosMap[arquero])
      : "-";
  const partidosJugados = String(
    victorias + empates + (derrotas !== "-" ? Number(derrotas) : 0)
  );
  const porcentajeVictoria =
    Number(partidosJugados) > 0
      ? ((victorias / Number(partidosJugados)) * 100).toFixed(1)
      : "-";
  return { partidosJugados, derrotas, porcentajeVictoria };
}

export function getArquerosMap(arqueros: any[]) {
  const map: Record<string, number> = {};
  arqueros.forEach((a) => {
    map[a.arquero] = a.golesRecibidos;
  });
  return map;
}

// Fecha de la próxima jornada (Jueves 19 de junio 2025, 18:00) -> Actualizar manual por ahora
export const NEXT_MATCH_DATE = new Date("2025-06-19T18:00:00-05:00");

export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  useEffect(() => {
    function update() {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("¡Es hoy!");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(
        `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
          .toString()
          .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      );
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

// Colores de clasificacion
export function getPosColor(idx: number) {
  if (idx < 2)
    return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900"; // dorado
  if (idx < 6) return "bg-blue-200 text-blue-900"; // azul
  return "bg-red-200 text-red-900"; // rojo
}

// Colores de goleadores - arqueros
export function getTopColor(idx: number) {
  if (idx === 0) return "bg-yellow-100 text-yellow-800"; // oro suave
  if (idx === 1) return "bg-gray-200 text-gray-700"; // plata suave
  if (idx === 2) return "bg-orange-100 text-orange-800"; // bronce suave
  return "";
}
