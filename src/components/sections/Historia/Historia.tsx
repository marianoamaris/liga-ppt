import React, { useState } from "react";
import type { Posicion } from "../../../types/jugador";
import { useJugadores } from "../../../hooks/useCatalogo";
import { useSede } from "../../../context/SedeContext";
import { SelectorSede } from "../../common/SelectorSede";
import { SidebarTabs } from "../../common/SidebarTabs";
import { UserCard } from "../../common/UserCard";
import MasGanadoresComponent from "./components/MasGanadoresComponent";
import { TablaPalmares } from "./components/TablaPalmares";
import HistoricoFinalesComponent from "./components/HistoricoFinalesComponent";
import SearchInput from "../../common/SearchInput";

const TABS = [
  { id: "jugadores", label: "Jugadores" },
  { id: "admins", label: "Admins" },
  { id: "goleadores", label: "Top Goleadores Histórico" },
  { id: "ganadores", label: "Los más ganadores" },
  { id: "capitanes", label: "Capitanes históricos" },
  { id: "historico_finales", label: "Histórico finales" },
  { id: "bota", label: "Bota de oro" },
  { id: "guante", label: "Guante de oro" },
  { id: "mvp", label: "MVP de la liga" },
  { id: "mvp_final", label: "MVP de la final" },
];

const POSICIONES: { id: "todas" | Posicion; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "arquero", label: "Arquero" },
  { id: "defensa", label: "Defensa" },
  { id: "mediocampista", label: "Mediocampista" },
  { id: "delantero", label: "Delantero" },
];

export const Historia: React.FC = () => {
  const [tab, setTab] = useState("jugadores");
  const [posicion, setPosicion] = useState<"todas" | Posicion>("todas");
  const [search, setSearch] = useState<string>("");
  const { sede } = useSede();
  const { jugadores, loading, error } = useJugadores();

  // Conteo total de jugadores por posición
  const conteoPorPosicion = jugadores.reduce(
    (acc, u) => {
      acc[u.posicion] = (acc[u.posicion] || 0) + 1;
      return acc;
    },
    {
      arquero: 0,
      defensa: 0,
      mediocampista: 0,
      delantero: 0,
    }
  );

  /** Mensaje a mostrar en lugar de la grilla mientras no haya padrón que listar. */
  const estadoPadron = loading
    ? "Cargando jugadores…"
    : error
      ? `No se pudo cargar el padrón: ${error}`
      : null;

  const usuariosFiltrados = jugadores.filter((u) => {
    // La búsqueda también mira el apodo: mucha gente conoce a un jugador por él
    if (search) {
      const q = search.toLowerCase();
      const coincide =
        u.nombre.toLowerCase().includes(q) ||
        (u.apodo?.toLowerCase().includes(q) ?? false);
      if (!coincide) return false;
    }

    if (tab === "jugadores") {
      return posicion === "todas" || u.posicion === posicion;
    }
    if (tab === "admins") {
      return u.es_admin;
    }
    return false;
  });

  return (
    <div className="flex min-h-full w-full max-w-full min-w-0 flex-col gap-6 bg-ink p-4 text-chalk lg:flex-row">
      <SidebarTabs
        tabs={TABS}
        tabSeleccionada={tab}
        setTabSeleccionada={setTab}
        setSearch={setSearch}
      />
      <div className="min-w-0 flex-1">
        {/* Toda esta pantalla es de una ciudad: sus récords no se mezclan con los
            de la otra. El selector va aquí, y no solo en la navegación, porque es
            donde se decide qué historia se está leyendo. */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="font-cond text-lg text-chalk">
            Historia{sede ? ` · ${sede.nombre}` : ""}
          </h1>
          <SelectorSede className="w-full max-w-[16rem]" mostrarEdicion={false} />
        </div>

        {(tab === "jugadores" || tab === "admins") && (
          <div className="flex flex-col gap-4">
            {tab === "jugadores" && (
              <>
                {/* El conteo por posición vive en el propio filtro: antes era una
                    fila de emojis aparte que repetía la misma información. */}
                <div className="flex flex-wrap gap-2">
                  {POSICIONES.map((p) => {
                    const n =
                      p.id === "todas"
                        ? jugadores.length
                        : conteoPorPosicion[p.id];
                    const activo = posicion === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPosicion(p.id)}
                        aria-pressed={activo}
                        className={`font-cond flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                          activo
                            ? "border-chalk-3 bg-raised text-chalk"
                            : "border-line text-chalk-3 hover:text-chalk-2"
                        }`}
                      >
                        {p.label}
                        <span className="tnum font-data text-[0.625rem] text-chalk-3">
                          {n}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </>
            )}

            {estadoPadron ? (
              <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
                {estadoPadron}
              </p>
            ) : usuariosFiltrados.length ? (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
                  {usuariosFiltrados.map((user) => (
                    <UserCard key={user.slug} jugador={user} />
                  ))}
                </div>
                <p className="font-cond text-[0.6875rem] text-chalk-3">
                  {usuariosFiltrados.length}{" "}
                  {usuariosFiltrados.length === 1 ? "jugador" : "jugadores"}
                </p>
              </>
            ) : (
              <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
                {search
                  ? `Nadie coincide con «${search}».`
                  : "No hay jugadores para mostrar."}
              </p>
            )}
          </div>
        )}
        {tab === "goleadores" && (
          <TablaPalmares
            tipo="goles_historicos"
            titulo="Top goleadores histórico"
            unidad="goles"
            descripcion="Goles acumulados en toda la historia de la liga."
          />
        )}
        {tab === "ganadores" && <MasGanadoresComponent />}
        {tab === "capitanes" && (
          <TablaPalmares
            tipo="capitan_campeon"
            titulo="Capitanes históricos"
            unidad="títulos"
            descripcion="Jugadores que levantaron el trofeo llevando el brazalete."
            columnaDetalle="Ediciones:"
          />
        )}
        {tab === "historico_finales" && <HistoricoFinalesComponent />}
        {tab === "bota" && (
          <TablaPalmares
            tipo="bota_oro"
            columnaDetalle="Ediciones:"
            titulo="Bota de oro"
            unidad="botas"
            descripcion="Máximo goleador de cada edición."
          />
        )}
        {tab === "guante" && (
          <TablaPalmares
            tipo="guante_oro"
            columnaDetalle="Ediciones:"
            titulo="Guante de oro"
            unidad="guantes"
            descripcion="Arquero menos batido de cada edición."
          />
        )}
        {tab === "mvp" && (
          <TablaPalmares
            tipo="mvp_liga"
            columnaDetalle="Ediciones:"
            titulo="MVP de la liga"
            unidad="premios"
            descripcion="Jugador más valioso de cada edición."
          />
        )}
        {tab === "mvp_final" && (
          <TablaPalmares
            tipo="mvp_final"
            columnaDetalle="Ediciones:"
            titulo="MVP de la final"
            unidad="premios"
            descripcion="Figura del partido decisivo."
          />
        )}
      </div>
    </div>
  );
};
