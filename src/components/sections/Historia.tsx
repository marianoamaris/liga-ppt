import React, { useState } from "react";
import { USUARIOS_LIGA } from "../../constants/USUARIOS_LIGA";
import { Card } from "../common/Card";
import noPhoto from "../../assets/no-photo.jpg";

const TABS = [
  { id: "jugadores", label: "Jugadores" },
  { id: "admins", label: "Admins" },
];

export const Historia: React.FC = () => {
  const [tab, setTab] = useState("jugadores");
  return (
    <div className="flex p-3 gap-8">
      {/* Sidebar de tabs */}
      <aside className="min-w-[160px] flex flex-col gap-2 pt-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-left transition border-l-4
              ${
                tab === t.id
                  ? "bg-gray-900 text-white border-l-blue-500 shadow-lg"
                  : "bg-gray-200 text-gray-700 border-l-transparent hover:bg-gray-300"
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </aside>
      {/* Contenido */}
      <div className="flex-1">
        {tab === "jugadores" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {USUARIOS_LIGA.map((user) => (
              <UserCard key={user.username} user={user} />
            ))}
          </div>
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

// Card tipo FIFA para usuario
const UserCard: React.FC<{ user: (typeof USUARIOS_LIGA)[0] }> = ({ user }) => {
  const isFundador = !!user.esFundador;
  const cardBg = isFundador
    ? "bg-gradient-to-b from-blue-100 to-gray-100 border-blue-400"
    : "bg-gradient-to-b from-gray-900 to-gray-700 border-gray-800";
  const nameColor = isFundador ? "text-blue-900" : "text-gray-100";
  return (
    <Card
      className={`relative flex flex-col items-center p-4 ${cardBg} border-2 shadow-lg rounded-2xl min-h-[300px]`}
    >
      {/* Avatar */}
      <div
        className={`w-20 h-20 rounded-full bg-gray-200 border-4 ${
          isFundador ? "border-blue-400" : "border-gray-700"
        } shadow mb-2 flex items-center justify-center overflow-hidden`}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="object-cover w-full h-full"
          />
        ) : user.username === "sirama" ? (
          <img
            src={noPhoto}
            alt="Default Facebook"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-4xl text-gray-400">⚽️</span>
        )}
      </div>
      {/* Nombre y username */}
      <div className="mb-1 text-center">
        <div className={`text-lg font-bold ${nameColor}`}>{user.name}</div>
        <div
          className={`text-xs ${
            isFundador ? "text-gray-600" : "text-gray-300"
          }`}
        >
          @{user.username}
        </div>
      </div>
      {/* Stats */}
      <div className="flex flex-col w-full gap-1 mt-2">
        <div
          className={`flex justify-between text-sm ${
            isFundador ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <span className="font-semibold">Ligas jugadas:</span>
          <span>{user.ligasJugadas}</span>
        </div>
        <div
          className={`flex justify-between text-sm ${
            isFundador ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <span className="font-semibold">Ligas ganadas:</span>
          <span>{user.ligasGanadas}</span>
        </div>
        <div
          className={`flex justify-between text-sm ${
            isFundador ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <span className="font-semibold">Goles totales:</span>
          <span>{user.golesTotales}</span>
        </div>
      </div>
      {/* Badges */}
      <div className="flex gap-2 mt-3">
        {user.esFundador && (
          <span className="px-2 py-0.5 text-xs rounded bg-blue-700 text-white font-bold">
            Fundador
          </span>
        )}
        {user.esAdmin && (
          <span className="px-2 py-0.5 text-xs rounded bg-gray-800 text-white font-bold">
            Admin
          </span>
        )}
      </div>
      {/* Posición */}
      <div
        className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
          isFundador ? "bg-blue-200 text-blue-900" : "bg-gray-800 text-gray-100"
        }`}
        title="Posición principal"
      >
        {user.posicion.charAt(0).toUpperCase() + user.posicion.slice(1)}
      </div>
    </Card>
  );
};
