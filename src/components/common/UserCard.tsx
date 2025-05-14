import React from "react";
import { Card } from "./Card";
import noPhoto from "../../assets/no-photo.jpg";
import type { UsuarioLiga } from "../../constants/USUARIOS_LIGA";
import { FaStar, FaTrophy, FaFutbol, FaMedal } from "react-icons/fa6";

export const UserCard: React.FC<{ user: UsuarioLiga }> = ({ user }) => {
  const isFundador = !!user.esFundador;
  const cardBg = isFundador
    ? "bg-gradient-to-b from-blue-100 to-gray-100 border-blue-400"
    : "bg-gradient-to-b from-gray-900 to-gray-700 border-gray-800";
  const nameColor = isFundador ? "text-blue-900" : "text-gray-100";
  return (
    <Card
      className={`relative flex flex-col items-center p-4 ${cardBg} border-2 shadow-lg rounded-2xl min-h-[300px]`}
    >
      {/* Estrellas de ligas ganadas */}
      <div className="flex gap-1 mb-1">
        {Array.from({ length: user.ligasGanadas }).map((_, i) => (
          <FaStar key={i} className="text-yellow-400" />
        ))}
      </div>
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
          className={`flex items-center justify-between text-sm ${
            isFundador ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <span className="font-semibold flex items-center gap-1">
            <FaMedal className="text-yellow-500" /> Ligas jugadas:
          </span>
          <span>{user.ligasJugadas}</span>
        </div>
        <div
          className={`flex items-center justify-between text-sm ${
            isFundador ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <span className="font-semibold flex items-center gap-1">
            <FaTrophy className="text-yellow-600" /> Ligas ganadas:
          </span>
          <span>{user.ligasGanadas}</span>
        </div>
        <div
          className={`flex items-center justify-between text-sm ${
            isFundador ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <span className="font-semibold flex items-center gap-1">
            <FaFutbol className="text-green-600" /> Goles totales:
          </span>
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
