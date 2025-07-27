import { useEffect, useState } from "react";
import React from "react";

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

// Fechas de las jornadas de la Liga PPT #14
export const JORNADAS_FECHAS = [
  { jornada: 1, fecha: new Date("2025-07-10"), nombre: "Jueves 10 de Julio" },
  { jornada: 2, fecha: new Date("2025-07-17"), nombre: "Jueves 17 de Julio" },
  { jornada: 3, fecha: new Date("2025-07-24"), nombre: "Jueves 24 de Julio" },
  { jornada: 4, fecha: new Date("2025-07-31"), nombre: "Jueves 31 de Julio" },
  { jornada: 5, fecha: new Date("2025-08-07"), nombre: "Jueves 7 de Agosto" },
  { jornada: 6, fecha: new Date("2025-08-14"), nombre: "Jueves 14 de Agosto" },
];

// Función para obtener la jornada actual automáticamente
export const getCurrentJornada = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Buscar la próxima jornada
  for (let i = 0; i < JORNADAS_FECHAS.length; i++) {
    const jornadaDate = new Date(JORNADAS_FECHAS[i].fecha);
    if (jornadaDate >= today) {
      return {
        jornada: JORNADAS_FECHAS[i].jornada,
        fecha: JORNADAS_FECHAS[i].fecha,
        nombre: JORNADAS_FECHAS[i].nombre,
        esProxima: true,
      };
    }
  }

  // Si no hay próxima jornada, la última es la actual
  const ultimaJornada = JORNADAS_FECHAS[JORNADAS_FECHAS.length - 1];
  return {
    jornada: ultimaJornada.jornada,
    fecha: ultimaJornada.fecha,
    nombre: ultimaJornada.nombre,
    esProxima: false,
  };
};

// Función para obtener la fecha de la próxima jornada para el countdown
export const getNextMatchDate = () => {
  const currentJornada = getCurrentJornada();
  return currentJornada.fecha;
};

// Actualizar NEXT_MATCH_DATE para que sea automático
export const NEXT_MATCH_DATE = getNextMatchDate();

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

// Hook personalizado para obtener información de la jornada actual
export const useCurrentJornada = () => {
  const [currentJornada, setCurrentJornada] = React.useState(
    getCurrentJornada()
  );
  const countdown = useCountdown(currentJornada.fecha);

  // Actualizar cada día a las 00:00
  React.useEffect(() => {
    const updateJornada = () => {
      setCurrentJornada(getCurrentJornada());
    };

    // Actualizar inmediatamente
    updateJornada();

    // Configurar actualización diaria
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      updateJornada();
      // Configurar actualización cada 24 horas
      setInterval(updateJornada, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  return {
    jornada: currentJornada.jornada,
    fecha: currentJornada.fecha,
    nombre: currentJornada.nombre,
    esProxima: currentJornada.esProxima,
    countdown,
    totalJornadas: JORNADAS_FECHAS.length,
  };
};
