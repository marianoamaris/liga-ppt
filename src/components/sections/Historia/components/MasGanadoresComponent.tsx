import { MAS_GANADORES } from "../../../../constants/GANADORES";

const porTitulosDesc = [...MAS_GANADORES].sort((a, b) => {
  if (b.titulos !== a.titulos) return b.titulos - a.titulos;
  return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
});

const MasGanadoresComponent = () => {
  return (
    <div className="min-w-0 w-full max-w-full">
      <h2 className="mb-4 text-2xl font-extrabold text-center text-gray-800">
        Los más ganadores
      </h2>
      <p className="mb-2 text-center text-xs text-gray-500 md:text-sm">
        Orden: más títulos a menos; a igual número de títulos, por nombre.
      </p>
      <p className="mb-2 text-xs text-center text-gray-500 md:hidden">
        Desliza horizontalmente para ver todas las columnas
      </p>
      <div className="min-w-0 overflow-x-auto rounded-xl border border-gray-200 shadow-lg [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[46rem] border-collapse text-left text-xs md:min-w-full md:w-full md:text-sm lg:text-base">
          <thead className="text-white bg-gradient-to-r from-yellow-700 to-yellow-400">
            <tr>
              <th className="px-2 py-2 text-xs font-bold md:px-4 md:py-3 md:text-lg">
                #
              </th>
              <th className="min-w-[10rem] px-2 py-2 text-xs font-bold md:min-w-0 md:px-4 md:py-3 md:text-lg">
                Nombre
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-xs font-bold md:px-4 md:py-3 md:text-lg">
                Títulos
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-center text-xs font-bold md:px-4 md:py-3 md:text-lg">
                <span className="md:hidden">Champ.</span>
                <span className="hidden md:inline">Champions</span>
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-center text-xs font-bold md:px-4 md:py-3 md:text-lg">
                <span className="md:hidden">Mund.</span>
                <span className="hidden md:inline">Mundial</span>
              </th>
              <th className="min-w-[7rem] px-2 py-2 text-xs font-bold md:min-w-0 md:px-4 md:py-3 md:text-lg">
                <span className="md:hidden">Ligas</span>
                <span className="hidden md:inline">Ligas ganadas</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {porTitulosDesc.map((g, idx) => {
              let rowClass = "";
              let medal = "";
              if (idx === 0) {
                rowClass = "bg-yellow-100 font-bold text-yellow-800";
                medal = "🥇";
              } else if (idx === 1) {
                rowClass = "bg-gray-200 font-semibold text-gray-700";
                medal = "🥈";
              } else if (idx === 2) {
                rowClass = "bg-orange-200 font-semibold text-orange-800";
                medal = "🥉";
              } else if (idx % 2 === 0) {
                rowClass = "bg-white";
              } else {
                rowClass = "bg-gray-50";
              }
              return (
                <tr
                  key={g.nombre}
                  className={
                    rowClass +
                    " border-t border-gray-100 transition-all hover:bg-yellow-50"
                  }
                >
                  <td className="px-2 py-1.5 text-base md:px-4 md:py-2 md:text-lg">
                    {medal || idx + 1}
                  </td>
                  <td className="min-w-[10rem] px-2 py-1.5 leading-snug md:px-4 md:py-2">
                    {g.nombre}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-center font-bold tabular-nums md:px-4 md:py-2 md:text-left">
                    {g.titulos}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-center font-semibold tabular-nums md:px-4 md:py-2">
                    {g.champions ?? 0}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-center font-semibold tabular-nums md:px-4 md:py-2">
                    {g.mundial ?? 0}
                  </td>
                  <td className="max-w-[12rem] whitespace-normal px-2 py-1.5 text-[11px] leading-snug md:max-w-none md:px-4 md:py-2 md:text-sm lg:text-base">
                    {g.ligas.join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasGanadoresComponent;
