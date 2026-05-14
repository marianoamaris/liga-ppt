import React from "react";
import { CAPITANES_HISTORICOS } from "../../../../constants/CAPITANES_HISTORICOS";
import { fotoJugadorPorNombre } from "../../../../utils/fotosJugadores";

const CapitanesHistoricosComponent: React.FC = () => (
  <div className="min-w-0 w-full max-w-full">
    <h2 className="mb-4 text-center text-2xl font-extrabold text-gray-800">
      Capitanes históricos
    </h2>
    <p className="mx-auto mb-4 max-w-2xl text-center text-sm text-gray-600">
      Capitanes que levantaron el título de la Liga PPT al menos una vez; se
      ordenan por número de títulos y luego por nombre.
    </p>
    <div className="min-w-0 overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
        <thead className="bg-gradient-to-r from-slate-800 to-slate-600 text-white">
          <tr>
            <th className="whitespace-nowrap px-3 py-3 font-semibold md:px-4">
              Posición
            </th>
            <th className="px-3 py-3 font-semibold md:px-4">
              Capitanes históricos
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-center font-semibold md:px-4">
              Títulos
            </th>
            <th className="min-w-[6rem] px-3 py-3 font-semibold md:px-4">
              Temporadas
            </th>
          </tr>
        </thead>
        <tbody>
          {CAPITANES_HISTORICOS.map((row, idx) => {
            const foto = fotoJugadorPorNombre(row.nombre);
            const isTop =
              idx === 0 ? "gold" : idx === 1 ? "silver" : idx === 2 ? "bronze" : "";
            const rowBg =
              isTop === "gold"
                ? "bg-amber-50 font-semibold text-amber-950"
                : isTop === "silver"
                  ? "bg-slate-100 font-medium text-slate-900"
                  : isTop === "bronze"
                    ? "bg-orange-50 font-medium text-orange-950"
                    : idx % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50";
            return (
              <tr
                key={`${row.nombre}-${row.temporadas}`}
                className={`${rowBg} border-t border-gray-100`}
              >
                <td className="whitespace-nowrap px-3 py-2.5 text-center tabular-nums md:px-4">
                  {row.rank}
                </td>
                <td className="px-3 py-2.5 md:px-4">
                  <div className="flex items-center gap-2">
                    {foto ? (
                      <img
                        src={foto}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full object-cover object-top ring-2 ring-white shadow"
                        decoding="async"
                      />
                    ) : null}
                    <span>{row.nombre}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-center tabular-nums md:px-4">
                  {row.titulos}
                </td>
                <td className="px-3 py-2.5 text-gray-800 md:px-4">
                  {row.temporadas}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default CapitanesHistoricosComponent;
