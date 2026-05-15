import React, { useCallback, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Card } from "../common/Card";
import { UserCard } from "../common/UserCard";
import { USUARIOS_LIGA } from "../../constants/USUARIOS_LIGA";
import imgCampeon from "../../assets/LIGA_18/liga-18-campeon.jpg";
import imgPremios from "../../assets/LIGA_18/liga-18-premios-individuales.jpg";

const SLIDE_COUNT = 2;

const userByUsername = (username: string) =>
  USUARIOS_LIGA.find((u) => u.username === username);

const UserCardGrid: React.FC<{ usernames: readonly string[] }> = ({
  usernames,
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {usernames.map((un) => {
      const u = userByUsername(un);
      return u ? <UserCard key={un} user={u} /> : null;
    })}
  </div>
);

const Liga18DestacadoCarousel: React.FC = () => {
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
    <Card className="relative mb-8 w-full max-w-5xl overflow-hidden border border-emerald-900/20 bg-gradient-to-b from-emerald-950 via-gray-900 to-black p-0 text-white shadow-xl">
      <div className="border-b border-white/10 px-4 py-3 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-400/90">
          Destacado Liga PPT
        </p>
        <h2 className="text-center text-lg font-bold text-white md:text-xl">
          Edición #18 · Champions League
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
                alt="Sporting Lisboa, campeón Liga PPT 18"
                className="mx-auto max-h-[420px] w-full object-contain md:max-h-[480px]"
                loading="lazy"
              />
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-gray-200 md:text-base">
              <p className="text-center text-base font-semibold text-emerald-300 md:text-lg">
                ¡Felicitaciones a Sporting Lisboa, campeón de la Liga PPT #18 –
                Edición Champions League!
              </p>
              <p>
                En una final inolvidable,{" "}
                <strong className="text-white">Sporting Lisboa</strong> se
                coronó tras vencer a{" "}
                <strong className="text-white">Tottenham Hotspur</strong> en la
                tanda de penales por <strong>2-0</strong>, luego de empatar{" "}
                <strong>3-3</strong> en el tiempo reglamentario, en una de las
                mejores finales en la historia de la Liga PPT.
              </p>
              <p>
                La noche también tuvo un espectacular duelo de arqueros entre{" "}
                <strong className="text-white">Brayan Cadena</strong> y{" "}
                <strong className="text-white">Fernando Gómez</strong>,
                protagonistas en los momentos decisivos.
              </p>
              <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-semibold text-emerald-300">
                    Goles Sporting Lisboa
                  </p>
                  <p>Santiago Corzo (×2) y Jesús Bullones</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-emerald-300">
                    Goles Tottenham Hotspur
                  </p>
                  <p>
                    Juan DLC, Eduardo Sarmiento (Mou) y Jairo Galván
                  </p>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-gray-300">
                Una final a la altura de una edición histórica.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner">
              <img
                src={imgPremios}
                alt="Premios individuales Liga PPT 18"
                className="mx-auto max-h-[360px] w-full object-contain md:max-h-[420px]"
                loading="lazy"
              />
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-gray-200 md:text-base">
              <p className="text-center text-base font-semibold text-amber-200 md:text-lg">
                Premios individuales – Liga PPT #18
              </p>
              <p>
                La temporada dejó grandes actuaciones y varios nombres que
                brillaron de principio a fin.{" "}
                <strong className="text-white">
                  Felicitaciones a todos los ganadores.
                </strong>
              </p>
              <p>
                Además de coronarse como los primeros campeones de la Edición
                Champions League, varios jugadores siguen sumando títulos en su
                historial.
              </p>
            </div>

            <div className="space-y-6 rounded-xl border border-white/10 bg-black/30 p-3 md:p-4">
              <div>
                <p className="mb-3 text-sm font-bold text-amber-300">
                  Cuarta liga
                </p>
                <UserCardGrid usernames={["rrojas", "bcadena"]} />
              </div>
              <div>
                <p className="mb-3 text-sm font-bold text-slate-200">
                  Segunda liga
                </p>
                <UserCardGrid
                  usernames={["jsolano", "scorzo", "jmosquera", "hduque"]}
                />
                <p className="mt-2 text-xs text-gray-400">
                  Héctor Duque también la conquista de forma consecutiva.
                </p>
              </div>
              <div>
                <p className="mb-3 text-sm font-bold text-orange-200">
                  Primer título en la Liga PPT
                </p>
                <UserCardGrid usernames={["jbullones", "jpinedo"]} />
              </div>
              <p className="text-center text-sm font-medium text-gray-300">
                ¡Felicitaciones a todos por seguir haciendo historia!
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
                    ? "w-8 bg-emerald-400"
                    : "w-2.5 bg-white/30 hover:bg-white/50"
                }`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 md:text-xs">
            {slide === 0 ? "Final y campeón" : "Premios y campeones"}
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

export default Liga18DestacadoCarousel;
