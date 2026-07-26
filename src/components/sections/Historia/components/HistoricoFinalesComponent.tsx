import React, { useMemo } from "react";
import type { ColorCamiseta, FinalHistorica } from "../../../../types/jugador";
import { ETIQUETA_COLOR, resumenVictoriasPorColor } from "../../../../utils/finales";
import { useFinales } from "../../../../hooks/useCatalogo";

/**
 * Color real de cada camiseta. Se usa como relleno del punto que acompaña al
 * equipo, no como fondo de texto: sobre un color pleno el marcador dejaría de
 * cumplir contraste en la mitad de los casos.
 */
const COLOR_CAMISETA: Record<ColorCamiseta, string> = {
  azul: "#1565C0",
  rojo: "#C62828",
  verde: "#2E7D32",
  morado: "#7B1FA2",
  negro: "#212121",
  rosado: "#E91E8C",
  blanco: "#F5F5F5",
  naranja: "#E65100",
  amarillo: "#FFD600",
};

function PuntoCamiseta({ color }: { color: ColorCamiseta }) {
  return (
    <span
      className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
      style={{ backgroundColor: COLOR_CAMISETA[color] }}
      title={ETIQUETA_COLOR[color]}
    />
  );
}

function Finalista({
  nombre,
  color,
  campeon,
  alineadoDerecha = false,
}: {
  nombre: string;
  color: ColorCamiseta;
  campeon: boolean;
  alineadoDerecha?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2 ${
        alineadoDerecha ? "flex-row-reverse text-right" : ""
      }`}
    >
      <PuntoCamiseta color={color} />
      <span
        className={`font-cond truncate text-sm ${campeon ? "text-chalk" : "text-chalk-3"}`}
      >
        {nombre}
      </span>
    </div>
  );
}

function FilaFinal({ f }: { f: FinalHistorica }) {
  const gana1 = f.resultado === "1";
  const gana2 = f.resultado === "2";
  const decidida = gana1 || gana2;

  return (
    <li className="border-t border-line py-3 first:border-t-0">
      <div className="grid grid-cols-[2.5rem_1fr_auto_1fr] items-center gap-3">
        <span className="tnum font-data text-xs text-chalk-3">#{f.temporada}</span>

        <Finalista nombre={f.equipo1} color={f.color1} campeon={gana1} />

        <span className="tnum font-data shrink-0 text-base font-bold text-chalk">
          {f.goles1 ?? "—"}
          <span className="mx-1 font-normal text-chalk-3">–</span>
          {f.goles2 ?? "—"}
        </span>

        <Finalista nombre={f.equipo2} color={f.color2} campeon={gana2} alineadoDerecha />
      </div>

      {(f.notaMarcador || !decidida) && (
        <p className="mt-1.5 pl-[3.25rem] text-[0.6875rem] text-chalk-3">
          {f.notaMarcador ??
            (f.resultado === "empate" ? "Terminó en empate" : "Final pendiente")}
        </p>
      )}
    </li>
  );
}

const HistoricoFinalesComponent: React.FC = () => {
  const { finales, loading, error } = useFinales();
  const resumen = useMemo(() => resumenVictoriasPorColor(finales), [finales]);

  // De la más reciente a la más antigua: es el orden en que se buscan
  const ordenadas = useMemo(
    () => [...finales].sort((a, b) => b.temporada - a.temporada),
    [finales]
  );

  const maxGanadas = resumen[0]?.ganadas ?? 0;

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="font-cond text-lg text-chalk">Histórico de finales</h2>
        <p className="mt-1 max-w-prose text-sm text-chalk-3">
          Resultado de cada final. El campeón va resaltado; el subcampeón, atenuado.
        </p>
      </div>

      {loading ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          Cargando finales…
        </p>
      ) : error ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          No se pudieron cargar las finales: {error}
        </p>
      ) : (
        <>
          <ul className="rounded-md border border-line bg-surface px-4">
            {ordenadas.map((f) => (
              <FilaFinal key={f.temporada} f={f} />
            ))}
          </ul>

          <div>
            <h3 className="font-cond text-sm text-chalk-2">
              Finales ganadas por color de camiseta
            </h3>
            <p className="mt-1 mb-3 text-[0.6875rem] text-chalk-3">
              Solo cuentan las finales con resultado definido.
            </p>
            <ul className="rounded-md border border-line bg-surface px-4">
              {resumen.map(({ color, ganadas, disputadas }) => (
                <li
                  key={color}
                  className="flex items-center gap-3 border-t border-line py-2 first:border-t-0"
                >
                  <PuntoCamiseta color={color} />
                  <span className="font-cond min-w-0 flex-1 truncate text-sm text-chalk">
                    {ETIQUETA_COLOR[color]}
                  </span>
                  <span className="hidden h-[3px] w-16 shrink-0 overflow-hidden rounded-full bg-line sm:block">
                    <span
                      className="block h-full bg-chalk-2"
                      style={{
                        width: maxGanadas ? `${(ganadas / maxGanadas) * 100}%` : "0%",
                      }}
                    />
                  </span>
                  <span className="tnum font-data w-20 shrink-0 text-right text-sm text-chalk">
                    <span className="font-bold">{ganadas}</span>
                    <span className="text-chalk-3"> de {disputadas}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
};

export default HistoricoFinalesComponent;
