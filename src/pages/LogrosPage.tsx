import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UsuarioLiga } from "../types/jugador";
import { useJugadores } from "../hooks/useCatalogo";
import { Puesto } from "../components/common/iconos";
import { fotoJugadorPorNombre } from "../utils/fotosJugadores";

// ── Types ──────────────────────────────────────────────────────────────────

type TeamData = {
  equipo: string;
  color: string;
  puntos: number;
  temporada: number;
  victorias?: number;
  empates?: number;
  derrotas?: number;
};

type UserRecord = {
  label: string;
  statLabel: string;
  type: "user";
  podium: UsuarioLiga[];
  stats: number[];
};

type EquipoRecord = {
  label: string;
  statLabel: string;
  type: "equipo";
  podium: TeamData[];
  stats: number[];
};

// ── Records ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "mas_goles_liga",        label: "Goles en una liga" },
  { id: "mas_goles_jornada",     label: "Goles en una jornada" },
  { id: "menos_goles_recibidos", label: "Menos goles recibidos" },
  { id: "mas_puntos_equipo",     label: "Más puntos de un equipo" },
  { id: "mas_puntos_jornada",    label: "Más puntos en una jornada" },
  { id: "menos_puntos_jornada",  label: "Menos puntos en una jornada" },
  { id: "menos_puntos_equipo",   label: "Menos puntos de un equipo" },
] as const;

type RecordId = (typeof TABS)[number]["id"];

const def = (name: string, username: string, posicion: UsuarioLiga["posicion"] = "delantero"): UsuarioLiga => ({
  name, username, ligasJugadas: 0, ligasGanadas: 0, golesTotales: 0, esAdmin: false, posicion,
});

/**
 * Los récords referencian jugadores por username. El padrón llega de la API, así
 * que se construyen dentro del componente; `def` cubre a quien ya no esté en él.
 */
const construirRecords = (
  find: (username: string) => UsuarioLiga | undefined
): Record<RecordId, UserRecord | EquipoRecord> => ({
  mas_goles_liga: {
    label: "Más goles anotados en una sola liga",
    statLabel: "goles",
    type: "user",
    podium: [
      find("enavarro") ?? def("Emanuel Navarro", "enavarro"),
      find("jhernandez") ?? def("José Hernández", "jhernandez"),
      find("jhassler") ?? def("Jürgen Hassler", "jhassler"),
    ],
    stats: [33, 31, 29],
  },
  mas_goles_jornada: {
    label: "Más goles anotados en una sola jornada",
    statLabel: "goles",
    type: "user",
    podium: [
      find("jhassler") ?? def("Jürgen Hassler", "jhassler"),
      find("scorzo") ?? def("Santiago Corzo", "scorzo"),
      find("jhernandez") ?? def("José Hernández", "jhernandez"),
    ],
    stats: [12, 12, 11],
  },
  menos_goles_recibidos: {
    label: "Menos goles recibidos en una liga (arquero)",
    statLabel: "recibidos",
    type: "user",
    podium: [
      find("jlaborde") ?? def("José Laborde", "jlaborde", "arquero"),
      find("bospino") ?? def("Brayan Ospino", "bospino", "arquero"),
      find("fgomez") ?? def("Fernando Gómez", "fgomez", "arquero"),
    ],
    stats: [22, 28, 29],
  },
  mas_puntos_equipo: {
    label: "Más puntos hechos por un equipo en una liga",
    statLabel: "puntos",
    type: "equipo",
    podium: [
      { equipo: "Greenworld",   color: "#22c55e", puntos: 186, temporada: 7,  victorias: 85, empates: 16, derrotas: 28 },
      { equipo: "Liverpool FC", color: "#ef4444", puntos: 160, temporada: 2,  victorias: 76, empates: 6,  derrotas: 0  },
      { equipo: "Sport Boys",   color: "#FF69B4", puntos: 150, temporada: 13, victorias: 67, empates: 16, derrotas: 39 },
    ],
    stats: [186, 160, 150],
  },
  mas_puntos_jornada: {
    label: "Más puntos hechos por un equipo en una sola jornada",
    statLabel: "puntos",
    type: "equipo",
    podium: [
      { equipo: "Países Bajos", color: "#F97316", puntos: 41, temporada: 19, victorias: 20, empates: 1, derrotas: 13 },
      { equipo: "Greenworld",   color: "#22C55E", puntos: 39, temporada:  7, victorias: 18, empates: 3, derrotas:  3 },
      { equipo: "Chelsea FC",   color: "#1E40AF", puntos: 38, temporada: 10, victorias: 18, empates: 2, derrotas:  4 },
    ],
    stats: [41, 39, 38],
  },
  menos_puntos_jornada: {
    label: "Menos puntos hechos por un equipo en una sola jornada",
    statLabel: "puntos",
    type: "equipo",
    podium: [
      { equipo: "Argentina", color: "#2563EB", puntos:  1, temporada: 19, victorias: 0, empates: 1, derrotas: 10 },
      { equipo: "Portugal",  color: "#D00027", puntos:  2, temporada: 19, victorias: 1, empates: 0, derrotas:  8 },
      { equipo: "Noruega",   color: "#FF69B4", puntos:  4, temporada: 19, victorias: 2, empates: 0, derrotas: 12 },
    ],
    stats: [1, 2, 4],
  },
  menos_puntos_equipo: {
    label: "Menos puntos hechos por un equipo en una liga",
    statLabel: "puntos",
    type: "equipo",
    podium: [
      { equipo: "Eintracht Frankfurt", color: "#1f2937", puntos: 62, temporada: 14 },
      { equipo: "Panathinaikos FC",    color: "#16a34a", puntos: 63, temporada: 10 },
      { equipo: "Orlando City",        color: "#7c3aed", puntos: 64, temporada: 15 },
    ],
    stats: [62, 63, 64],
  },
});

// ── Podium slot config (display order: 2nd left, 1st center, 3rd right) ──

const SLOTS = [
  {
    dataIdx: 1,
    rank: 2,
    barH: 104,
    tono: "var(--color-chalk-2)",
    label: "Segundo",
  },
  {
    dataIdx: 0,
    rank: 1,
    barH: 160,
    tono: "var(--color-chalk)",
    label: "Primero",
  },
  {
    dataIdx: 2,
    rank: 3,
    barH: 72,
    tono: "var(--color-chalk-3)",
    label: "Tercero",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function PlayerAvatar({ user, size }: { user: UsuarioLiga; size: number }) {
  const src = fotoJugadorPorNombre(user.name);
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full bg-raised ring-2 ring-line"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover object-top" />
      ) : (
        <span className="font-cond grid size-full place-items-center text-chalk-3">
          {user.name.charAt(0)}
        </span>
      )}
    </div>
  );
}

/** Los récords de equipo se identifican por su color de camiseta. */
function TeamDot({ color, size }: { color: string; size: number }) {
  return (
    <div
      className="shrink-0 rounded-full ring-2 ring-chalk-3"
      style={{ width: size, height: size, background: color }}
    />
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export const LogrosPage: React.FC = () => {
  const [selected, setSelected] = useState<RecordId>("mas_goles_liga");
  const { buscarPorUsername } = useJugadores();
  const records = useMemo(
    () => construirRecords(buscarPorUsername),
    [buscarPorUsername]
  );
  const data = records[selected];

  return (
    <div className="min-h-full bg-ink">
      {/* Header */}
      <div className="relative pt-10 pb-2 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-cond mb-2 text-[0.625rem] text-chalk-3">
            Liga PPT · Todos los tiempos
          </p>
          <h1 className="font-cond text-4xl text-chalk">Récords</h1>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="relative px-4 pt-6 pb-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {TABS.map((tab, i) => {
            const active = selected === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setSelected(tab.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={active}
                className={`font-cond rounded-sm border px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                  active
                    ? "border-chalk-3 bg-raised text-chalk"
                    : "border-line text-chalk-3 hover:text-chalk-2"
                }`}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Podium */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative px-4 pt-6 pb-10"
        >
          <p className="font-cond mb-10 text-center text-[0.6875rem] text-chalk-3">
            {data.label}
          </p>

          <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
            {SLOTS.map((slot, i) => {
              const item = data.podium[slot.dataIdx];
              const stat = data.stats[slot.dataIdx];
              const isGold = slot.rank === 1;

              return (
                <motion.div
                  key={slot.rank}
                  initial={{ opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.09,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col items-center"
                  style={{ flex: isGold ? "0 0 42%" : "0 0 27%", maxWidth: isGold ? 200 : 152 }}
                >
                  {/* Card */}
                  <div
                    className={`mb-2 flex w-full flex-col items-center gap-2 rounded-md border bg-surface p-3 ${
                      isGold ? "border-chalk-3" : "border-line"
                    }`}
                  >
                    <Puesto n={slot.rank} className={isGold ? "size-6 text-xs" : ""} />

                    {/* Avatar / team dot */}
                    {data.type === "user" ? (
                      <PlayerAvatar
                        user={item as UsuarioLiga}
                        size={isGold ? 76 : 56}
                      />
                    ) : (
                      <TeamDot
                        color={(item as TeamData).color}
                        size={isGold ? 68 : 52}
                      />
                    )}

                    {/* Name */}
                    <div className="text-center px-1">
                      <div
                        className="font-cond leading-tight text-chalk"
                        style={{ fontSize: isGold ? "0.9rem" : "0.78rem" }}
                      >
                        {data.type === "user"
                          ? (item as UsuarioLiga).name
                          : (item as TeamData).equipo}
                      </div>
                      {data.type === "user" ? (
                        <div className="text-[0.625rem] text-chalk-3">
                          @{(item as UsuarioLiga).username}
                        </div>
                      ) : (
                        <div className="font-cond text-[0.625rem] text-chalk-3">
                          Edición {(item as TeamData).temporada}
                        </div>
                      )}
                    </div>

                    {/* Stat */}
                    <div
                      className="tnum font-data leading-none font-bold tracking-tight"
                      style={{ fontSize: isGold ? "2rem" : "1.5rem", color: slot.tono }}
                    >
                      {stat}
                    </div>
                    <div className="font-cond -mt-1 text-[0.625rem] text-chalk-3">
                      {data.statLabel}
                    </div>
                  </div>

                  {/* Podium block */}
                  <div
                    className="relative flex w-full items-center justify-center overflow-hidden rounded-t-md bg-surface"
                    style={{ height: slot.barH, borderTop: `2px solid ${slot.tono}` }}
                  >
                    <span
                      className="tnum font-data leading-none font-bold select-none opacity-[0.12]"
                      style={{ fontSize: isGold ? "5rem" : "3.5rem", color: slot.tono }}
                    >
                      {slot.rank}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Suelo del podio */}
          <div className="mx-auto h-px max-w-2xl bg-line" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
