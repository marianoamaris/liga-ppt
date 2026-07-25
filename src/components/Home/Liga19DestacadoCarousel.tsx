import React, { useCallback, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Card } from "../common/Card";
import { UserCard } from "../common/UserCard";
import { useJugadores } from "../../hooks/useCatalogo";
import imgCampeon from "../../assets/LIGA_19/liga-19-campeon.jpg";

const SLIDE_COUNT = 2;

const UserCardGrid: React.FC<{ usernames: readonly string[] }> = ({
  usernames,
}) => {
  const { buscarPorUsername } = useJugadores();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {usernames.map((un) => {
        const u = buscarPorUsername(un);
        return u ? <UserCard key={un} user={u} /> : null;
      })}
    </div>
  );
};

const Liga19DestacadoCarousel: React.FC = () => {
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((dir: -1 | 1) => {
    setSlide((s) => (s + dir + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    if (dx > 56) go(-1);
    else if (dx < -56) go(1);
  };

  return (
    <Card className="relative mb-8 w-full max-w-5xl overflow-hidden border border-green-800/30 bg-gradient-to-b from-green-950 via-emerald-950 to-black p-0 text-white shadow-xl">
      <div className="border-b border-white/10 px-4 py-3 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-lime-400/90">
          Destacado Liga PPT
        </p>
        <h2 className="text-center text-lg font-bold text-white md:text-xl">
          🌍🏆 Edición #19 · Mundial — ¡Brasil campeón! 🇧🇷
        </h2>
      </div>

      <div
        className="touch-pan-y px-3 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slide === 0 ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner">
              <img
                src={imgCampeon}
                alt="Brasil, campeón Liga PPT 19 – Edición Mundial"
                className="mx-auto max-h-[420px] w-full object-contain md:max-h-[480px]"
                loading="lazy"
              />
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-gray-200 md:text-base">
              <p className="text-center text-base font-semibold text-lime-300 md:text-lg">
                ¡Brasil es el campeón de la Liga PPT #19 – Edición Mundial! 🇧🇷🌍
              </p>
              <p>
                En una final llena de emociones,{" "}
                <strong className="text-white">Brasil</strong> derrotó{" "}
                <strong>11-5</strong> a{" "}
                <strong className="text-white">México</strong> y levantó el
                trofeo de campeón.
              </p>
              <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-semibold text-yellow-300">
                    🟡 Goleadores de Brasil
                  </p>
                  <p>
                    José Hernández (4), Luis Rico (4), Luis Suárez (2) y
                    Frederick (1)
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-green-300">
                    🟢 Goleadores de México
                  </p>
                  <p>Toto (2), Jürgen Hassler (2) y Héctor Jr (1)</p>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-gray-300">
                ¡Así termina una histórica Liga PPT #19! 🔥⚽
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-3 text-sm leading-relaxed text-gray-200 md:text-base">
              <p className="text-center text-base font-semibold text-amber-200 md:text-lg">
                ¡Felicitaciones a los campeones de la Liga PPT #19! 🏆
              </p>
              <p>
                <strong className="text-white">Eudes Pavajeau</strong> conquista
                su quinta Liga PPT, quedando solo por detrás de Emanuel Navarro
                (7) e igualando a Cristian Benjumea, Keni Contreras y Frank
                Ramírez en el segundo lugar del palmarés histórico. 👏
              </p>
            </div>

            <div className="space-y-6 rounded-xl border border-white/10 bg-black/30 p-3 md:p-4">
              <div>
                <p className="mb-3 text-sm font-bold text-amber-300">
                  Quinta liga ⭐
                </p>
                <UserCardGrid usernames={["epavajeau"]} />
              </div>
              <div>
                <p className="mb-3 text-sm font-bold text-yellow-200">
                  Cuarta liga
                </p>
                <UserCardGrid usernames={["fmolina"]} />
              </div>
              <div>
                <p className="mb-3 text-sm font-bold text-slate-200">
                  Tercera liga
                </p>
                <UserCardGrid usernames={["jhernandez"]} />
              </div>
              <div>
                <p className="mb-3 text-sm font-bold text-emerald-200">
                  Segunda liga
                </p>
                <UserCardGrid usernames={["fgomez"]} />
              </div>
              <div>
                <p className="mb-3 text-sm font-bold text-orange-200">
                  Primer título en la Liga PPT 🎉
                </p>
                <UserCardGrid
                  usernames={["lpaez", "lsuarez", "lrico", "ddaza"]}
                />
              </div>
              <p className="text-center text-sm font-medium text-gray-300">
                ¡Felicitaciones a todos por este logro y por escribir un nuevo
                capítulo en la historia de la Liga PPT! 🏆⚽
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-black/50 px-3 py-3 md:px-6">
        <button
          type="button"
          className="rounded-full p-2 text-white transition hover:bg-white/10"
          aria-label="Anterior"
          onClick={() => go(-1)}
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex gap-2">
            {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir al destacado ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  slide === i
                    ? "w-8 bg-lime-400"
                    : "w-2.5 bg-white/30 hover:bg-white/50"
                }`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 md:text-xs">
            {slide === 0 ? "Final y campeón" : "Palmarés de los campeones"}
          </span>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-white transition hover:bg-white/10"
          aria-label="Siguiente"
          onClick={() => go(1)}
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>
    </Card>
  );
};

export default Liga19DestacadoCarousel;
