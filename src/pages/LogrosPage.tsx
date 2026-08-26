import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FilaRecord, TipoRecord } from "../types/jugador";
import { useRecords } from "../hooks/useCatalogo";
import { useSede } from "../context/SedeContext";
import { SelectorSede } from "../components/common/SelectorSede";
import { Puesto } from "../components/common/iconos";
import { fotoJugadorPorArchivo } from "../utils/fotosJugadores";

/**
 * Catálogo de récords: qué se muestra y cómo se llama.
 *
 * Los podios ya no viven aquí —están en `sede_records`, separados por ciudad—
 * pero las etiquetas sí: son copy de la interfaz, no datos, y añadir un tipo
 * de récord implica tocar esta pantalla de todos modos.
 */
const TABS: { id: TipoRecord; label: string; titulo: string; unidad: string }[] = [
  {
    id: "mas_goles_liga",
    label: "Goles en una liga",
    titulo: "Más goles anotados en una sola liga",
    unidad: "goles",
  },
  {
    id: "mas_goles_jornada",
    label: "Goles en una jornada",
    titulo: "Más goles anotados en una sola jornada",
    unidad: "goles",
  },
  {
    id: "menos_goles_recibidos",
    label: "Menos goles recibidos",
    titulo: "Menos goles recibidos en una liga (arquero)",
    unidad: "recibidos",
  },
  {
    id: "mas_puntos_equipo",
    label: "Más puntos de un equipo",
    titulo: "Más puntos hechos por un equipo en una liga",
    unidad: "puntos",
  },
  {
    id: "mas_puntos_jornada",
    label: "Más puntos en una jornada",
    titulo: "Más puntos hechos por un equipo en una sola jornada",
    unidad: "puntos",
  },
  {
    id: "menos_puntos_jornada",
    label: "Menos puntos en una jornada",
    titulo: "Menos puntos hechos por un equipo en una sola jornada",
    unidad: "puntos",
  },
  {
    id: "menos_puntos_equipo",
    label: "Menos puntos de un equipo",
    titulo: "Menos puntos hechos por un equipo en una liga",
    unidad: "puntos",
  },
];

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

/** Nombre a mostrar: el del padrón si el récord resuelve, si no la grafía original. */
function nombreDe(fila: FilaRecord): string {
  return (
    fila.jugadores?.nombre ?? fila.jugador_nombre ?? fila.equipo_nombre ?? "—"
  );
}

function PlayerAvatar({ fila, size }: { fila: FilaRecord; size: number }) {
  const src = fotoJugadorPorArchivo(fila.jugadores?.foto_archivo ?? null);
  const nombre = nombreDe(fila);

  return (
    <div
      className="shrink-0 overflow-hidden rounded-full bg-raised ring-2 ring-line"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover object-top" />
      ) : (
        <span className="font-cond grid size-full place-items-center text-chalk-3">
          {nombre.charAt(0)}
        </span>
      )}
    </div>
  );
}

/** Los récords de equipo se identifican por su color de camiseta. */
function TeamDot({ color, size }: { color: string | null; size: number }) {
  return (
    <div
      className="shrink-0 rounded-full ring-2 ring-chalk-3"
      style={{ width: size, height: size, background: color ?? "#4B5563" }}
    />
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto max-w-md rounded-md border border-line bg-surface px-4 py-5 text-center text-sm text-chalk-3">
      {children}
    </p>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export const LogrosPage: React.FC = () => {
  const [selected, setSelected] = useState<TipoRecord>("mas_goles_liga");
  const { sede, sedeId } = useSede();
  const { de, loading, error } = useRecords(sedeId);

  const tab = TABS.find((t) => t.id === selected)!;
  // El orden lo fija la base con `posicion`; el podio solo lo reordena para
  // pintar el 2.º a la izquierda y el 3.º a la derecha.
  const podio = [...de(selected)].sort((a, b) => a.posicion - b.posicion);

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
            {sede ? `${sede.nombre} · Todos los tiempos` : "Liga PPT"}
          </p>
          <h1 className="font-cond text-4xl text-chalk">Récords</h1>
        </motion.div>

        {/* Los récords no se mezclan entre ciudades: cada una tiene los suyos. */}
        <SelectorSede
          className="mx-auto mt-5 w-full max-w-[16rem] px-4"
          mostrarEdicion={false}
        />
      </div>

      {/* Tabs */}
      <div className="relative px-4 pt-6 pb-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {TABS.map((t, i) => {
            const active = selected === t.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => setSelected(t.id)}
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
                {t.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Podium */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sedeId}-${selected}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative px-4 pt-6 pb-10"
        >
          <p className="font-cond mb-10 text-center text-[0.6875rem] text-chalk-3">
            {tab.titulo}
          </p>

          {loading ? (
            <Aviso>Cargando récords…</Aviso>
          ) : error ? (
            <Aviso>No se pudieron cargar los récords: {error}</Aviso>
          ) : !podio.length ? (
            // Una ciudad recién abierta no tiene récords que batir todavía.
            <Aviso>
              {sede?.nombre ?? "Esta ciudad"} todavía no tiene este récord registrado.
            </Aviso>
          ) : (
            <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
              {SLOTS.map((slot, i) => {
                const item = podio[slot.dataIdx];
                // El podio puede venir incompleto: no todos los récords tienen
                // tres puestos registrados.
                if (!item) return null;

                const isGold = slot.rank === 1;
                const esEquipo = item.equipo_nombre != null;

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

                      {esEquipo ? (
                        <TeamDot color={item.equipo_color} size={isGold ? 68 : 52} />
                      ) : (
                        <PlayerAvatar fila={item} size={isGold ? 76 : 56} />
                      )}

                      {/* Name */}
                      <div className="text-center px-1">
                        <div
                          className="font-cond leading-tight text-chalk"
                          style={{ fontSize: isGold ? "0.9rem" : "0.78rem" }}
                        >
                          {nombreDe(item)}
                        </div>
                        {/* La edición solo consta en los récords de equipo; en los
                            de jugador la fuente heredada no la registraba. */}
                        {item.numero_sede != null ? (
                          <div className="font-cond text-[0.625rem] text-chalk-3">
                            Edición {item.numero_sede}
                          </div>
                        ) : item.jugadores ? (
                          <div className="text-[0.625rem] text-chalk-3">
                            @{item.jugadores.username ?? item.jugadores.slug}
                          </div>
                        ) : null}
                      </div>

                      {/* Stat */}
                      <div
                        className="tnum font-data leading-none font-bold tracking-tight"
                        style={{ fontSize: isGold ? "2rem" : "1.5rem", color: slot.tono }}
                      >
                        {item.valor}
                      </div>
                      <div className="font-cond -mt-1 text-[0.625rem] text-chalk-3">
                        {tab.unidad}
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
          )}

          {/* Suelo del podio */}
          <div className="mx-auto mt-0 h-px max-w-2xl bg-line" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
