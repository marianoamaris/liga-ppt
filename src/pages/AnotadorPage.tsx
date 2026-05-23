import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { SetupJornada } from "../components/anotador/SetupJornada";
import { PartidoEnVivo } from "../components/anotador/PartidoEnVivo";
import { ResumenPartido } from "../components/anotador/ResumenPartido";
import { useAuth } from "../context/AuthContext";
import { partidosApi, type ApiEquipo, type Partido } from "../lib/api";
import { LIGA_19_EQUIPOS } from "../constants/liga19";
import type {
  Evento,
  EquipoEnCancha,
  PartidoConfig,
  PartidoVivo,
} from "../components/anotador/types";

// ── Persistencia del partido activo ───────────────────────────────────────────

const LS_ACTIVE = "ligappt_active";

function saveActive(backendId: string, anotadorId: string) {
  localStorage.setItem(LS_ACTIVE, JSON.stringify({ backendId, anotadorId }));
}
function loadActive(): { backendId: string; anotadorId: string } | null {
  try {
    const raw = localStorage.getItem(LS_ACTIVE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function clearActive() {
  localStorage.removeItem(LS_ACTIVE);
}

// ── Conversión backend → local ────────────────────────────────────────────────

function toApiEquipos(equipos: EquipoEnCancha[]): ApiEquipo[] {
  return equipos.map((eq) => ({
    equipo: { id: eq.equipo.id, nombre: eq.equipo.nombre },
    jugadores: eq.jugadores,
    arqueroDesignado: eq.arqueroDesignado,
  }));
}

function fromBackend(bp: Partido): PartidoVivo {
  const equipos: EquipoEnCancha[] = bp.equipos.map((eq) => {
    const local = LIGA_19_EQUIPOS.find((e) => e.id === eq.equipo.id);
    return {
      equipo: local ?? { id: eq.equipo.id, nombre: eq.equipo.nombre, imagen: "" },
      jugadores: eq.jugadores,
      arqueroDesignado: eq.arqueroDesignado,
    };
  });

  const config: PartidoConfig =
    bp.modo === "jornada"
      ? {
          modo: "jornada",
          jornada: bp.jornada ?? 1,
          equipos: equipos as [EquipoEnCancha, EquipoEnCancha, EquipoEnCancha],
        }
      : {
          modo: bp.modo as "cuartos" | "semifinal" | "final",
          equipos: equipos as [EquipoEnCancha, EquipoEnCancha],
        };

  return {
    config,
    eventos: bp.eventos,
    iniciadoEn: new Date(bp.iniciado_en).getTime(),
  };
}

type Phase = "login" | "restoring" | "setup" | "live" | "resumen";

// ── Login form ─────────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-center">
          <img src="/ligaPPT-escudo.png" alt="Liga PPT" className="w-14 h-14 mx-auto mb-3 object-contain" />
          <h1 className="text-white text-xl font-black">Zona Anotadores</h1>
          <p className="text-gray-500 text-sm mt-0.5">Liga PPT · Edición #19</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800 shadow-2xl">
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block">Correo</label>
            <input
              type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600 min-h-[52px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block">Contraseña</label>
            <input
              type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600 min-h-[52px]"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 rounded-xl py-2 px-3">{error}</p>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full min-h-[52px] bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl text-base transition-colors"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const EVENTOS_VACIO: Evento[] = [];

export function AnotadorPage() {
  const { profile, loading: authLoading, logout } = useAuth();
  const [phase, setPhase] = useState<Phase>("login");
  const [partido, setPartido] = useState<PartidoVivo | null>(null);
  const backendIdRef = useRef<string | null>(null);

  // ── Restore session on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!profile) { setPhase("login"); return; }

    const active = loadActive();
    if (!active || active.anotadorId !== profile.id) {
      // No active match or belongs to a different annotator
      setPhase("setup");
      return;
    }

    // Recover match state from backend (server is the source of truth)
    setPhase("restoring");
    partidosApi
      .get(active.backendId)
      .then((bp) => {
        backendIdRef.current = bp.id;
        if (bp.finalizado_en) {
          // Rule 1: partido finalizado is immutable — go straight to resumen
          setPartido(fromBackend(bp));
          setPhase("resumen");
          clearActive();
        } else if (bp.anotador_id !== profile.id) {
          // Rule 2: can only modify own match
          clearActive();
          setPhase("setup");
        } else {
          setPartido(fromBackend(bp));
          setPhase("live");
        }
      })
      .catch(() => {
        clearActive();
        setPhase("setup");
      });
  }, [authLoading, profile]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleIniciar = useCallback(
    async (config: PartidoConfig) => {
      if (!profile) return;
      const localNow = Date.now();
      const nuevo: PartidoVivo = { config, eventos: EVENTOS_VACIO, iniciadoEn: localNow };
      setPartido(nuevo);
      setPhase("live");

      try {
        const created = await partidosApi.create({
          temporada: 19,
          modo: config.modo,
          ...(config.modo === "jornada" ? { jornada: config.jornada } : {}),
          equipos: toApiEquipos(config.equipos),
        });
        backendIdRef.current = created.id;
        saveActive(created.id, profile.id);

        // Sync iniciadoEn from server for precise elapsed-time
        const serverTs = new Date(created.iniciado_en).getTime();
        setPartido((prev) => (prev ? { ...prev, iniciadoEn: serverTs } : prev));
      } catch (err) {
        console.error("Backend: no se pudo crear partido", err);
      }
    },
    [profile]
  );

  const handleUpdatePartido = useCallback((p: PartidoVivo | null) => {
    setPartido(p);
    const id = backendIdRef.current;
    // Rule 1: never PATCH a finalized match (guard in PartidoEnVivo, but double-check)
    if (p && id) {
      partidosApi.update(id, p.eventos).catch((err) =>
        console.error("Backend: sync eventos", err)
      );
    }
  }, []);

  const handleFinalizar = useCallback(async () => {
    const id = backendIdRef.current;
    setPhase("resumen");
    clearActive();
    if (id) {
      partidosApi.finalizar(id).catch((err) =>
        console.error("Backend: finalizar", err)
      );
    }
  }, []);

  function handleNuevoPartido() {
    setPartido(null);
    backendIdRef.current = null;
    clearActive();
    setPhase("setup");
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  if (authLoading || phase === "restoring") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Cargando…</p>
      </div>
    );
  }

  if (phase === "login" || !profile) {
    return <LoginForm onSuccess={() => setPhase("setup")} />;
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Annotator badge + logout */}
        <div className="flex items-center justify-between px-4 pt-4 pb-0">
          <span className="text-gray-600 text-xs">
            🖊 {profile.nombre}
          </span>
          <button
            onClick={async () => { await logout(); setPhase("login"); }}
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
          >
            Salir
          </button>
        </div>
        <SetupJornada onIniciar={handleIniciar} />
      </div>
    );
  }

  if (phase === "live" && partido) {
    return (
      <PartidoEnVivo
        partido={partido}
        onUpdatePartido={handleUpdatePartido}
        onFinalizar={handleFinalizar}
      />
    );
  }

  if (phase === "resumen" && partido) {
    return (
      <ResumenPartido partido={partido} onNuevoPartido={handleNuevoPartido} />
    );
  }

  return null;
}
