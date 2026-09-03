import { useCallback, useEffect, useState } from "react";

/**
 * Reloj del partido, anclado al reloj de pared.
 *
 * Un contador que va restando un segundo con `setTimeout` sirve para los ocho
 * minutos de una jornada, pero no para los cincuenta de un playoff: el móvil
 * del anotador bloquea la pantalla, el navegador frena los temporizadores de la
 * pestaña en segundo plano y el marcador se queda atrás del partido real. Aquí
 * se guarda cuándo arrancó y cuánto llevaba acumulado, y el tiempo transcurrido
 * se calcula al vuelo: al volver de la pantalla apagada el reloj ya está en su
 * sitio.
 *
 * Se persiste porque el partido dura casi una hora: si la pestaña se recarga a
 * mitad, el minuto de los goles siguientes tiene que seguir siendo el del
 * partido y no el de la recarga.
 */

interface Estado {
  /** Segundos jugados antes del último arranque. */
  acumulado: number;
  /** `Date.now()` del arranque en curso; null si el reloj está parado. */
  desde: number | null;
}

const PARADO: Estado = { acumulado: 0, desde: null };
const PREFIJO = "ligappt_reloj_";

function clave(partidoId: number): string {
  return `${PREFIJO}${partidoId}`;
}

function leer(partidoId: number): Estado {
  try {
    const raw = localStorage.getItem(clave(partidoId));
    if (!raw) return PARADO;
    const guardado = JSON.parse(raw) as Estado;
    if (typeof guardado.acumulado !== "number") return PARADO;
    return guardado;
  } catch {
    return PARADO;
  }
}

/** Solo hay un partido a la vez: los relojes de partidos viejos estorban. */
function guardar(partidoId: number, estado: Estado): void {
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith(PREFIJO) && k !== clave(partidoId)) localStorage.removeItem(k);
    }
    localStorage.setItem(clave(partidoId), JSON.stringify(estado));
  } catch {
    // Sin localStorage el reloj sigue funcionando, solo no sobrevive a recargas.
  }
}

function transcurridoDe(estado: Estado, duracion: number): number {
  const enCurso = estado.desde != null ? (Date.now() - estado.desde) / 1000 : 0;
  return Math.min(duracion, Math.floor(estado.acumulado + enCurso));
}

export function useReloj(partidoId: number, duracion: number) {
  const [estado, setEstado] = useState<Estado>(() => leer(partidoId));
  // Repintar cada segundo mientras corre; el valor sale del reloj de pared, no
  // de contar ticks, así que perder alguno no descuadra nada.
  const [, tick] = useState(0);

  const corriendo = estado.desde != null;
  const transcurrido = transcurridoDe(estado, duracion);
  const restante = Math.max(0, duracion - transcurrido);

  const cambiar = useCallback(
    (siguiente: Estado) => {
      setEstado(siguiente);
      guardar(partidoId, siguiente);
    },
    [partidoId]
  );

  useEffect(() => {
    if (!corriendo) return;
    const i = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(i);
  }, [corriendo]);

  // Al agotarse el tiempo el reloj se para solo, para que no siga corriendo por
  // dentro mientras el marcador ya muestra 00:00.
  useEffect(() => {
    if (corriendo && restante === 0) cambiar({ acumulado: duracion, desde: null });
  }, [corriendo, restante, duracion, cambiar]);

  const alternar = useCallback(() => {
    if (estado.desde != null) {
      cambiar({ acumulado: transcurridoDe(estado, duracion), desde: null });
    } else {
      cambiar({ acumulado: estado.acumulado, desde: Date.now() });
    }
  }, [estado, duracion, cambiar]);

  /** Vuelve a cero y parado: en jornada lo usa cada gol, además del botón ↺. */
  const reiniciar = useCallback(() => cambiar(PARADO), [cambiar]);

  return { transcurrido, restante, corriendo, alternar, reiniciar };
}
