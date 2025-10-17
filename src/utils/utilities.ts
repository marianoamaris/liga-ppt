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

  // Usar row.derrotas si está disponible, sino calcular basándose en arquero
  let derrotas;
  if (row.derrotas !== undefined && row.derrotas !== null) {
    derrotas = String(row.derrotas);
  } else {
    // Buscar el nombre del arquero para este equipo
    const arquero = arquerosEquipoMap[equipo];
    derrotas =
      arquero && arquerosMap[arquero] !== undefined
        ? String(arquerosMap[arquero])
        : "-";
  }

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

// Fechas de las jornadas de la Liga PPT #15
export const JORNADAS_FECHAS = [
  {
    jornada: 1,
    fecha: new Date("2025-09-11T18:00:00"),
    nombre: "Jueves 11 de Septiembre - 6:00 PM",
  },
  {
    jornada: 2,
    fecha: new Date("2025-09-18T18:00:00"),
    nombre: "Jueves 18 de Septiembre - 6:00 PM",
  },
  {
    jornada: 3,
    fecha: new Date("2025-09-25T18:00:00"),
    nombre: "Jueves 25 de Septiembre - 6:00 PM",
  },
  {
    jornada: 4,
    fecha: new Date("2025-10-02T18:00:00"),
    nombre: "Jueves 2 de Octubre - 6:00 PM",
  },
  {
    jornada: 5,
    fecha: new Date("2025-10-09T18:00:00"),
    nombre: "Jueves 9 de Octubre - 6:00 PM",
  },
  {
    jornada: 6,
    fecha: new Date("2025-10-16T18:00:00"),
    nombre: "Jueves 16 de Octubre - 6:00 PM",
  },
];

// Fechas de playoffs de la Liga PPT #15
export const PLAYOFFS_FECHAS = [
  {
    fase: "Cuartos de Final",
    fecha: new Date("2025-10-19T19:00:00"),
    nombre:
      "🟠 Luton Town FC vs 🟢 Deportivo Cali - Domingo 19 Oct 7:00 PM\n⚫ DC United vs 🔴 Al-Ahly - Domingo 19 Oct 8:00 PM",
  },
  {
    fase: "semifinales",
    fecha: new Date("2025-10-23T19:00:00"),
    nombre: "Jueves 23 de Octubre - Semifinales (7:00 PM - 9:00 PM)",
  },
  {
    fase: "final",
    fecha: new Date("2025-10-26T19:00:00"),
    nombre: "Domingo 26 de Octubre - Final (7:00 PM - 9:00 PM)",
  },
];

// Función para obtener la jornada actual automáticamente
export const getCurrentJornada = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Priorizar jornadas de Liga 15 (empezando 11 de septiembre)
  for (let i = 0; i < JORNADAS_FECHAS.length; i++) {
    const jornadaDate = new Date(JORNADAS_FECHAS[i].fecha);
    if (jornadaDate >= today) {
      return {
        jornada: JORNADAS_FECHAS[i].jornada,
        fecha: jornadaDate,
        nombre: JORNADAS_FECHAS[i].nombre,
        esProxima: true,
        tipo: "jornada",
        fase: null,
      };
    }
  }

  // Si no hay jornadas próximas, verificar playoffs
  for (let i = 0; i < PLAYOFFS_FECHAS.length; i++) {
    const playoffDate = new Date(PLAYOFFS_FECHAS[i].fecha);
    if (playoffDate >= today) {
      return {
        jornada: `playoff_${PLAYOFFS_FECHAS[i].fase}`,
        fecha: playoffDate,
        nombre: PLAYOFFS_FECHAS[i].nombre,
        esProxima: true,
        tipo: "playoff",
        fase: PLAYOFFS_FECHAS[i].fase,
      };
    }
  }

  // Si no hay próxima jornada ni playoff, la última es la actual
  const ultimaJornada = JORNADAS_FECHAS[JORNADAS_FECHAS.length - 1];
  return {
    jornada: ultimaJornada.jornada,
    fecha: ultimaJornada.fecha,
    nombre: ultimaJornada.nombre,
    esProxima: false,
    tipo: "jornada",
    fase: null,
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
    tipo: currentJornada.tipo,
    fase: currentJornada.fase,
  };
};
