import React, { useState } from "react";
import type { Posicion } from "../../constants/USUARIOS_LIGA";
import { USUARIOS_LIGA } from "../../constants/USUARIOS_LIGA";
import { SidebarTabs } from "../common/SidebarTabs";
import { UserCard } from "../common/UserCard";

const TABS = [
  { id: "jugadores", label: "Jugadores" },
  { id: "admins", label: "Admins" },
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

  // Filtrado de jugadores por posición
  const jugadoresFiltrados =
    posicion === "todas"
      ? USUARIOS_LIGA
      : USUARIOS_LIGA.filter((u) => u.posicion === posicion);

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
            {/* Subfiltro de posiciones */}
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
              {jugadoresFiltrados.map((user) => (
                <UserCard key={user.username} user={user} />
              ))}
            </div>
          </>
        )}
        {tab === "admins" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {USUARIOS_LIGA.filter((user) => user.esAdmin).map((user) => (
              <UserCard key={user.username} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
