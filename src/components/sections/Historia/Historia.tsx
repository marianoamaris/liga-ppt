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

  const usuariosFiltrados = USUARIOS_LIGA.filter((u) => {
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
    <div className="flex gap-8 p-3">
      <SidebarTabs
        tabs={TABS}
        tabSeleccionada={tab}
        setTabSeleccionada={setTab}
      />
      <div className="flex-1">
        {tab === "jugadores" && (
          <>
            <div className="flex gap-2 mb-4">
              {POSICIONES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPosicion(p.id)}
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {usuariosFiltrados.map((user, index) => (
                <UserCard key={index} user={user} />
              ))}
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
