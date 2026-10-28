import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useConsulta } from "../lib/cache";
import { consultas } from "../lib/consultas";
import { CLAVE_SEDE, SEDE_POR_DEFECTO } from "../config";
import type { Sede } from "../types/jugador";

/**
 * Qué ciudad se está mirando.
 *
 * Antes esto era la constante `EDICION_ACTUAL`, y abrir una edición nueva
 * exigía un despliegue. Ahora la edición en curso de cada sede la declara la
 * base (`ediciones.estado = 'activa'`) y llega en el mismo `GET /sedes`.
 *
 * La sede elegida se guarda en localStorage y no en la URL: un enlace a
 * /clasificacion abre la ciudad que cada quien tenga guardada. Si algún día se
 * quiere que la URL mande, basta alimentar `cambiarSede` desde el router —
 * ninguna vista lee la sede de otro sitio que no sea este contexto.
 */
interface EstadoSede {
  sedes: Sede[];
  /** Sede activa; null solo mientras carga o si la API falla. */
  sede: Sede | null;
  sedeId: string;
  cambiarSede: (id: string) => void;

  /**
   * Clave interna de la edición en curso de la sede activa — la que se pasa a
   * la API como `temporada`. Null si la sede no tiene ninguna edición abierta.
   */
  edicionActual: number | null;
  /** Número visible de esa misma edición. */
  numeroSede: number | null;

  loading: boolean;
  error: string | null;
}

const Contexto = createContext<EstadoSede | null>(null);

function sedeGuardada(): string {
  try {
    return localStorage.getItem(CLAVE_SEDE) ?? SEDE_POR_DEFECTO;
  } catch {
    // Safari en privado lanza al tocar localStorage.
    return SEDE_POR_DEFECTO;
  }
}

const SIN_SEDES: Sede[] = [];

export function SedeProvider({ children }: { children: ReactNode }) {
  // Por la caché, como todo: el provider se monta una sola vez, pero así las
  // sedes se revalidan al volver a la pestaña pasado un rato, y una edición
  // recién abierta aparece sin tener que recargar la página.
  const { datos, loading, error } = useConsulta(consultas.sedes());
  const sedes = datos?.sedes ?? SIN_SEDES;
  const [elegida, setSedeId] = useState<string>(sedeGuardada);

  // La sede guardada puede haberse desactivado o no existir ya.
  const sedeId =
    !sedes.length || sedes.some((s) => s.id === elegida)
      ? elegida
      : sedes[0]?.id ?? SEDE_POR_DEFECTO;

  const cambiarSede = useCallback((id: string) => {
    setSedeId(id);
    try {
      localStorage.setItem(CLAVE_SEDE, id);
    } catch {
      // Sin persistencia la sede dura lo que la pestaña; no es motivo de error.
    }
  }, []);

  const valor = useMemo<EstadoSede>(() => {
    const sede = sedes.find((s) => s.id === sedeId) ?? null;
    return {
      sedes,
      sede,
      sedeId,
      cambiarSede,
      edicionActual: sede?.edicion_activa?.numero ?? null,
      numeroSede: sede?.edicion_activa?.numero_sede ?? null,
      loading,
      error,
    };
  }, [sedes, sedeId, cambiarSede, loading, error]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSede(): EstadoSede {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useSede debe usarse dentro de <SedeProvider>");
  return ctx;
}
