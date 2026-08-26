import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sedesApi } from "../lib/api";
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

export function SedeProvider({ children }: { children: ReactNode }) {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [sedeId, setSedeId] = useState<string>(sedeGuardada);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    sedesApi
      .list()
      .then((r) => {
        if (cancelado) return;
        setSedes(r.sedes);
        // La sede guardada puede haberse desactivado o no existir ya.
        setSedeId((actual) =>
          r.sedes.some((s) => s.id === actual)
            ? actual
            : r.sedes[0]?.id ?? SEDE_POR_DEFECTO
        );
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelado) return;
        setError(e instanceof Error ? e.message : "No se pudieron cargar las sedes");
        setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

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
