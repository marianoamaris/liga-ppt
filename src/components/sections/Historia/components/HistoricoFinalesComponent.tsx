import {
  ETIQUETA_COLOR,
  FINALES_HISTORICAS,
  resumenVictoriasPorColor,
  type ColorCamiseta,
  type FinalHistorica,
} from "../../../../constants/HISTORICO_FINALES";
import championsLogo from "../../../../assets/UEFA_Champions_League_logo.png";

const chipColor: Record<ColorCamiseta, string> = {
  azul: "bg-blue-600 text-white",
  rojo: "bg-red-600 text-white",
  verde: "bg-green-600 text-white",
  morado: "bg-purple-600 text-white",
  negro: "bg-gray-900 text-white",
  rosado: "bg-pink-400 text-gray-900",
  blanco: "bg-gray-100 text-gray-900 border border-gray-300",
  naranja: "bg-orange-500 text-white",
  amarillo: "bg-yellow-400 text-gray-900",
};

function MarcadorCelda({
  goles,
  color,
  destacado,
}: {
  goles: number | null;
  color: ColorCamiseta;
  destacado: boolean;
}) {
  if (goles === null) {
    return (
      <span
        className={`inline-flex min-w-[2.25rem] items-center justify-center rounded px-2 py-1 text-sm font-bold ${chipColor[color]} opacity-60`}
      >
        —
      </span>
    );
  }
  return (
    <span
      className={`inline-flex min-w-[2.25rem] items-center justify-center rounded px-2 py-1 text-sm font-bold transition ${
        chipColor[color]
      } ${destacado ? "ring-2 ring-offset-2 ring-yellow-400" : "opacity-90"}`}
    >
      {goles}
    </span>
  );
}

function FilaFinal({ f }: { f: FinalHistorica }) {
  const gana1 = f.resultado === "1";
  const gana2 = f.resultado === "2";
  const empate = f.resultado === "empate";
  const pendiente = f.resultado === "pendiente";
  const esFinalChampions = f.temporada === 18;

  const rowClass = esFinalChampions
    ? "relative border-y border-[#c9a227]/45 bg-gradient-to-r from-[#050a14] via-[#0c1f45] to-[#050a14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
    : f.temporada % 2 === 0
      ? "bg-gray-50 border-t border-gray-100"
      : "bg-white border-t border-gray-100";

  const chipUcl =
    "inline-block rounded px-2 py-1 text-sm font-semibold bg-blue-950/75 text-white border border-white/10 shadow-sm ring-1 ring-[#c9a227]/30";

  return (
    <tr className={rowClass}>
      <td
        className={`px-3 py-3 whitespace-nowrap ${
          esFinalChampions
            ? "align-middle text-[#c9a227]"
            : "font-semibold text-gray-800"
        }`}
      >
        {esFinalChampions ? (
          <div className="flex items-start gap-2 leading-tight">
            <img
              src={championsLogo}
              alt="Champions"
              width={40}
              height={40}
              className="shrink-0 object-contain w-9 h-9 mt-0.5 md:w-10 md:h-10"
              loading="lazy"
              decoding="async"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-black tracking-tight">18</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100/90">
                Champions
              </span>
            </div>
          </div>
        ) : (
          f.temporada
        )}
      </td>
      <td className="px-3 py-3">
        <span
          className={
            esFinalChampions
              ? chipUcl
              : `inline-block rounded px-2 py-1 text-sm font-medium ${chipColor[f.color1]}`
          }
        >
          {f.equipo1}
        </span>
      </td>
      <td className="px-3 py-3 text-center">
        {pendiente ? (
          esFinalChampions ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-100/70">
                Final Champions
              </span>
              <span className="text-sm font-bold tracking-wide text-[#c9a227]">
                Por definir
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-amber-700">
              Por definir
            </span>
          )
        ) : empate ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <MarcadorCelda
              goles={f.goles1}
              color={f.color1}
              destacado={false}
            />
            <span className="text-gray-500">—</span>
            <MarcadorCelda
              goles={f.goles2}
              color={f.color2}
              destacado={false}
            />
            <span className="w-full text-xs font-semibold text-gray-600 sm:w-auto">
              Empate
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2">
              <MarcadorCelda
                goles={f.goles1}
                color={f.color1}
                destacado={gana1}
              />
              <span className="font-bold text-gray-400">—</span>
              <MarcadorCelda
                goles={f.goles2}
                color={f.color2}
                destacado={gana2}
              />
            </div>
            {f.notaMarcador ? (
              <span className="max-w-[16rem] text-xs font-medium leading-snug text-gray-600 md:max-w-none">
                {f.notaMarcador}
              </span>
            ) : null}
          </div>
        )}
      </td>
      <td className="px-3 py-3">
        <span
          className={
            esFinalChampions
              ? chipUcl
              : `inline-block rounded px-2 py-1 text-sm font-medium ${chipColor[f.color2]}`
          }
        >
          {f.equipo2}
        </span>
      </td>
    </tr>
  );
}

const HistoricoFinalesComponent = () => {
  const resumen = resumenVictoriasPorColor();

  return (
    <div className="overflow-x-auto">
      <h2 className="mb-2 text-2xl font-extrabold text-center text-gray-800">
        Histórico de finales
      </h2>
      <p className="max-w-3xl mx-auto mb-6 text-sm text-center text-gray-600 md:text-base">
        Resultado de las finales por temporada. El marcador resalta al campeón
        según el color de camiseta del equipo ganador.
      </p>

      <table className="min-w-full overflow-hidden text-sm text-left border border-gray-200 shadow-lg md:text-base rounded-xl">
        <thead className="text-white bg-gradient-to-r from-slate-800 to-slate-600">
          <tr>
            <th className="px-3 py-3 rounded-tl-xl md:px-4">Temp.</th>
            <th className="px-3 py-3 md:px-4">Equipo 1</th>
            <th className="px-3 py-3 text-center md:px-4">Marcador</th>
            <th className="px-3 py-3 rounded-tr-xl md:px-4">Equipo 2</th>
          </tr>
        </thead>
        <tbody>
          {FINALES_HISTORICAS.map((f) => (
            <FilaFinal key={f.temporada} f={f} />
          ))}
        </tbody>
      </table>

      <section className="p-5 mt-8 border border-gray-200 shadow-md bg-gradient-to-br from-amber-50 to-white rounded-xl">
        <h3 className="mb-3 text-lg font-bold text-gray-900 md:text-xl">
          Resumen: finales ganadas por color de camiseta
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Solo se cuentan victorias en la final con resultado definido. No
          incluye empates ni la final pendiente.
        </p>
        <ul className="space-y-2">
          {resumen.map(({ color, finales }) => (
            <li
              key={color}
              className="flex flex-wrap items-center gap-2 text-base text-gray-800"
            >
              <span
                className={`inline-block min-w-[5.5rem] rounded px-2 py-0.5 text-sm font-semibold text-center ${chipColor[color]}`}
              >
                {ETIQUETA_COLOR[color]}
              </span>
              <span>
                <strong className="font-bold text-gray-900">{finales}</strong>{" "}
                {finales === 1 ? "final ganada" : "finales ganadas"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HistoricoFinalesComponent;
