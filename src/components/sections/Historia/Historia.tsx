import React, { useState } from "react";
import type { Posicion } from "../../../constants/USUARIOS_LIGA";
import { USUARIOS_LIGA } from "../../../constants/USUARIOS_LIGA";
import { SidebarTabs } from "../../common/SidebarTabs";
import { UserCard } from "../../common/UserCard";
import MvpFinalComponent from "./components/MvpFinalComponent";
import MvpLigaComponent from "./components/MvpLigaComponent";
import GuanteDeOroComponent from "./components/GuanteDeOroComponent";
import BotaDeOroComponent from "./components/BotaDeOroComponent";
import MasGanadoresComponent from "./components/MasGanadoresComponent";
import HistoricoGoleadoresComponent from "./components/HistoricoGoleadoresComponent";
import SearchInput from "../../common/SearchInput";

const TABS = [
  { id: "jugadores", label: "Jugadores" },
  { id: "admins", label: "Admins" },
  { id: "goleadores", label: "Top Goleadores Histórico" },
  { id: "ganadores", label: "Los más ganadores" },
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
  // Conteo total de jugadores por posición
  const conteoPorPosicion = USUARIOS_LIGA.reduce(
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

  const usuariosFiltrados = USUARIOS_LIGA.filter((u) => {
    // First apply search filter if there's a search term
    if (search && !u.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (tab === "jugadores") {
      if (posicion === "todas") return true;
      return (
        u.posicion &&
        u.posicion.trim().toLowerCase() === posicion.trim().toLowerCase()
      );
    }
    if (tab === "admins") {
      return u.esAdmin;
    }
    return false;
  });

  return (
    <div className="flex flex-col gap-8 p-3 lg:flex-row">
      <SidebarTabs
        tabs={TABS}
        tabSeleccionada={tab}
        setTabSeleccionada={setTab}
        setSearch={setSearch}
      />
      <div className="flex-1">
        {tab === "jugadores" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              {/* Filtros de posición */}
              <div className="flex flex-wrap gap-2">
                {POSICIONES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPosicion(p.id);
                      setSearch("");
                    }}
                    className={`px-3 py-1 rounded-full font-semibold border transition text-xs
                      ${
                        posicion === p.id
                          ? "bg-blue-700 text-white border-blue-700"
                          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                      }
                    `}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {/* Conteo total de jugadores por posición con tooltips y mayor tamaño */}
              <div className="flex items-center gap-6">
                <div
                  className="relative flex flex-col items-center cursor-pointer group"
                  title="Arqueros"
                >
                  <span className="text-2xl">🧤</span>
                  <span className="text-lg font-bold text-gray-700">
                    {conteoPorPosicion.arquero}
                  </span>
                  <span className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                    Arqueros
                  </span>
                </div>
                <div
                  className="relative flex flex-col items-center cursor-pointer group"
                  title="Defensas"
                >
                  <span className="text-2xl">🛡️</span>
                  <span className="text-lg font-bold text-gray-700">
                    {conteoPorPosicion.defensa}
                  </span>
                  <span className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                    Defensas
                  </span>
                </div>
                <div
                  className="relative flex flex-col items-center cursor-pointer group"
                  title="Mediocampistas"
                >
                  <span className="text-2xl">🎽</span>
                  <span className="text-lg font-bold text-gray-700">
                    {conteoPorPosicion.mediocampista}
                  </span>
                  <span className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                    Mediocampistas
                  </span>
                </div>
                <div
                  className="relative flex flex-col items-center cursor-pointer group"
                  title="Delanteros"
                >
                  <span className="text-2xl">🥅</span>
                  <span className="text-lg font-bold text-gray-700">
                    {conteoPorPosicion.delantero}
                  </span>
                  <span className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                    Delanteros
                  </span>
                </div>
              </div>
            </div>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div
              className={
                !usuariosFiltrados.length
                  ? ""
                  : "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }
            >
              {!usuariosFiltrados.length ? (
                <span className="text-sm text-center text-gray-500 md:text-base">
                  No hay jugadores para mostrar
                </span>
              ) : (
                usuariosFiltrados.map((user, index) => (
                  <UserCard key={index} user={user} />
                ))
              )}
            </div>
          </>
        )}
        {tab === "admins" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {usuariosFiltrados.map((user) => (
              <UserCard key={user.username} user={user} />
            ))}
          </div>
        )}
        {tab === "goleadores" && <HistoricoGoleadoresComponent />}
        {tab === "ganadores" && <MasGanadoresComponent />}
        {tab === "bota" && <BotaDeOroComponent />}
        {tab === "guante" && <GuanteDeOroComponent />}
        {tab === "mvp" && <MvpLigaComponent />}
        {tab === "mvp_final" && <MvpFinalComponent />}
      </div>
    </div>
  );
};
