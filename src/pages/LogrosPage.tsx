import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { USUARIOS_LIGA, type UsuarioLiga } from "../constants/USUARIOS_LIGA";
import { fotoJugadorPorNombre } from "../utils/fotosJugadores";
import noPhoto from "../assets/no-photo.jpg";

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
  { id: "mas_goles_liga",        label: "Goles en liga",    icon: "⚽" },
  { id: "mas_goles_jornada",     label: "Goles en jornada", icon: "🔥" },
  { id: "menos_goles_recibidos", label: "Menos goles arco", icon: "🧤" },
  { id: "mas_puntos_equipo",     label: "Más puntos",       icon: "🏅" },
  { id: "menos_puntos_equipo",   label: "Menos puntos",     icon: "📉" },
] as const;

type RecordId = (typeof TABS)[number]["id"];

const def = (name: string, username: string, posicion: UsuarioLiga["posicion"] = "delantero"): UsuarioLiga => ({
  name, username, ligasJugadas: 0, ligasGanadas: 0, golesTotales: 0, esAdmin: false, posicion,
});

const find = (username: string) => USUARIOS_LIGA.find((u) => u.username === username);

const RECORDS: Record<RecordId, UserRecord | EquipoRecord> = {
  mas_goles_liga: {
    label: "Más goles anotados en una sola liga",
    statLabel: "goles",
    type: "user",
    podium: [
      find("enavarro") ?? def("Emanuel Navarro", "enavarro"),
      find("jhernandez") ?? def("José Hernández", "jhernandez"),
      find("jdlc") ?? def("Juan de la Cruz", "jdlc"),
    ],
    stats: [33, 31, 29],
  },
  mas_goles_jornada: {
    label: "Más goles anotados en una sola jornada",
    statLabel: "goles",
    type: "user",
    podium: [
      find("scorzo") ?? def("Santiago Corzo", "scorzo"),
      find("jhernandez") ?? def("José Hernández", "jhernandez"),
      find("vcastilla") ?? def("Víctor Castilla", "vcastilla"),
    ],
    stats: [12, 11, 10],
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
};

// ── Podium slot config (display order: 2nd left, 1st center, 3rd right) ──

const SLOTS = [
  {
    dataIdx: 1,
    rank: 2,
    barH: 104,
    gradFrom: "#475569",
    gradTo:   "#94a3b8",
    glowColor: "rgba(148,163,184,0.25)",
    textShade: "#cbd5e1",
    medal: "🥈",
    label: "PLATA",
  },
  {
    dataIdx: 0,
    rank: 1,
    barH: 160,
    gradFrom: "#b45309",
    gradTo:   "#fbbf24",
    glowColor: "rgba(251,191,36,0.35)",
    textShade: "#fef3c7",
    medal: "🥇",
    label: "ORO",
  },
  {
    dataIdx: 2,
    rank: 3,
    barH: 72,
    gradFrom: "#92400e",
    gradTo:   "#d97706",
    glowColor: "rgba(217,119,6,0.25)",
    textShade: "#fde68a",
    medal: "🥉",
    label: "BRONCE",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function PlayerAvatar({ user, size }: { user: UsuarioLiga; size: number }) {
  const src = user.username === "sirama" ? noPhoto : fotoJugadorPorNombre(user.name);
  return (
    <div
      className="rounded-full overflow-hidden shrink-0 border-2 border-white/20"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={user.name}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xl">
          ⚽
        </div>
      )}
    </div>
  );
}

function TeamDot({ color, size }: { color: string; size: number }) {
  return (
    <div
      className="rounded-full border-2 border-white/25 shadow-lg shrink-0"
      style={{ width: size, height: size, background: color }}
    />
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export const LogrosPage: React.FC = () => {
  const [selected, setSelected] = useState<RecordId>("mas_goles_liga");
  const data = RECORDS[selected];

  return (
    <div
      className="min-h-screen rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #060c06 0%, #0a160a 50%, #0d1f0d 100%)",
      }}
    >
      {/* Subtle pitch glow at bottom */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 40% at 50% 105%, rgba(34,197,94,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative pt-10 pb-2 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-green-500/50 text-[10px] tracking-[0.35em] uppercase font-semibold mb-2">
            Liga PPT · Todos los tiempos
          </p>
          <h1
            className="text-5xl font-black text-white uppercase tracking-[0.18em] mb-1"
            style={{ textShadow: "0 0 40px rgba(251,191,36,0.2)" }}
          >
            RÉCORDS
          </h1>
          <div className="w-16 h-0.5 mx-auto mt-3 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
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
                className="relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200"
                style={{
                  border: active
                    ? "1px solid rgba(251,191,36,0.6)"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: active ? "#fbbf24" : "rgba(255,255,255,0.4)",
                  background: active
                    ? "rgba(251,191,36,0.08)"
                    : "rgba(255,255,255,0.03)",
                  boxShadow: active
                    ? "0 0 16px rgba(251,191,36,0.18), inset 0 0 8px rgba(251,191,36,0.06)"
                    : "none",
                }}
              >
                <span className="mr-1.5">{tab.icon}</span>
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
          <p className="text-center text-white/25 text-[10px] uppercase tracking-widest mb-10">
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
                    className="w-full rounded-2xl p-3 flex flex-col items-center gap-2 mb-2"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: isGold
                        ? `1px solid rgba(251,191,36,0.3)`
                        : `1px solid rgba(255,255,255,0.07)`,
                      backdropFilter: "blur(8px)",
                      boxShadow: isGold
                        ? `0 0 40px ${slot.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`
                        : `0 4px 20px rgba(0,0,0,0.3)`,
                    }}
                  >
                    {/* Medal */}
                    <span className={isGold ? "text-3xl" : "text-2xl"}>
                      {slot.medal}
                    </span>

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
                        className="font-bold leading-tight text-white"
                        style={{ fontSize: isGold ? "0.85rem" : "0.72rem" }}
                      >
                        {data.type === "user"
                          ? (item as UsuarioLiga).name
                          : (item as TeamData).equipo}
                      </div>
                      {data.type === "user" ? (
                        <div className="text-gray-500 text-[10px]">
                          @{(item as UsuarioLiga).username}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-[10px]">
                          Liga {(item as TeamData).temporada}
                        </div>
                      )}
                    </div>

                    {/* Stat */}
                    <div
                      className="font-black leading-none"
                      style={{
                        fontSize: isGold ? "2rem" : "1.5rem",
                        color: slot.gradTo,
                        textShadow: `0 0 20px ${slot.glowColor}`,
                      }}
                    >
                      {stat}
                    </div>
                    <div className="text-gray-600 text-[10px] -mt-1 uppercase tracking-wider">
                      {data.statLabel}
                    </div>
                  </div>

                  {/* Podium block */}
                  <div
                    className="w-full rounded-t-xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      height: slot.barH,
                      background: `linear-gradient(180deg, ${slot.gradFrom} 0%, ${slot.gradFrom}44 100%)`,
                      borderTop: `2px solid ${slot.gradTo}60`,
                    }}
                  >
                    {/* Shine line at top */}
                    <div
                      className="absolute top-0 inset-x-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${slot.gradTo}90, transparent)`,
                      }}
                    />
                    <span
                      className="font-black select-none"
                      style={{
                        fontSize: isGold ? "5rem" : "3.5rem",
                        color: slot.textShade,
                        opacity: 0.15,
                        lineHeight: 1,
                      }}
                    >
                      {slot.rank}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Floor line */}
          <div
            className="max-w-2xl mx-auto mt-0 h-0.5"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 80%, transparent)",
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
