import { EQUIPOS_FULL } from "../../constants_HOME/HOME";
import { getPosColor } from "../../utils/utilities";

const TablaEnVivo = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-5xl mb-8">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-lg font-bold text-center text-blue-900">
        <span>
          Sigue la información en vivo de los datos a premios individuales
        </span>
        <span className="flex items-center gap-2 px-2 py-0.5 text-xs font-bold uppercase bg-black text-white rounded-md border border-black ml-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          DATOS EN VIVO
        </span>
      </div>
      <div className="flex flex-col items-start justify-center w-full gap-4 lg:flex-row">
        {/* Tabla de equipos */}
        <div className="flex-1 min-w-full lg:min-w-[180px]">
          <div className="mb-2 text-sm font-bold text-center text-gray-800">
            Tabla de equipos
          </div>
          <table className="w-full overflow-hidden text-xs bg-white border shadow-lg rounded-2xl">
            <thead>
              <tr className="h-8 text-gray-700 bg-gray-50">
                <th className="px-2 py-1">P</th>
                <th className="px-2 py-1">C</th>
                <th className="px-2 py-1 text-left">Equipo</th>
                <th className="px-2 py-1">PJ</th>
                <th className="px-2 py-1">V</th>
                <th className="px-2 py-1">E</th>
                <th className="px-2 py-1">D</th>
                <th className="px-2 py-1">%V</th>
                <th className="px-2 py-1">PTS</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPOS_FULL.map((eq, i) => (
                <tr key={eq.nombre} className="h-8 border-b last:border-b-0">
                  <td
                    className={`px-2 py-1 text-base font-bold text-center align-middle ${getPosColor(
                      i
                    )}`}
                  >
                    {i + 1}
                  </td>
                  <td className="px-2 py-1 text-center align-middle">
                    <span
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: 14,
                        background: eq.color,
                        borderRadius: "50%",
                        border: "1px solid #888",
                        verticalAlign: "middle",
                      }}
                    />
                  </td>
                  <td className="px-2 py-1 font-semibold text-left align-middle">
                    {eq.nombre}
                  </td>
                  <td className="px-2 py-1 font-mono italic text-center align-middle">
                    {eq.pj}
                  </td>
                  <td className="px-2 py-1 font-mono italic text-center align-middle">
                    {eq.v}
                  </td>
                  <td className="px-2 py-1 font-mono italic text-center align-middle">
                    {eq.e}
                  </td>
                  <td className="px-2 py-1 font-mono italic text-center align-middle">
                    {eq.d}
                  </td>
                  <td className="px-2 py-1 font-mono italic text-center align-middle">
                    {eq.perc}
                  </td>
                  <td className="px-2 py-1 font-bold text-center text-black align-middle">
                    {eq.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* SOLO SE DEBE DESCOMENTAR EN LIGA CORRIENTE */}
        {/* <TopGoleadoresArquerosTraspasos /> */}
      </div>
    </div>
  );
};

export default TablaEnVivo;
