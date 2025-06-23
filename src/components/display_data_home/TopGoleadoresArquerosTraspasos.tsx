import { ARQUEROS, GOLEADORES } from "../../constants_HOME/HOME";
import { getTopColor } from "../../utils/utilities";

const TopGoleadoresArquerosTraspasos = () => {
  return (
    <div className="flex flex-col w-full gap-4 lg:w-auto">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Tabla de goleadores */}
        <div className="flex-1 min-w-full lg:min-w-[160px]">
          <div className="mb-2 text-sm font-bold text-center text-gray-800">
            Top 5 Goleadores
          </div>
          <table className="w-full overflow-hidden text-xs bg-white border shadow-lg rounded-2xl">
            <thead>
              <tr className="h-8 text-gray-700 bg-gray-50">
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1 text-left">Jugador</th>
                <th className="px-2 py-1 text-center">C</th>
                <th className="px-2 py-1">Goles</th>
              </tr>
            </thead>
            <tbody>
              {GOLEADORES.map((g, i) => (
                <tr
                  key={g.nombre}
                  className={`border-b last:border-b-0 ${getTopColor(i)} h-8`}
                >
                  <td className="px-2 py-1 text-base font-bold text-center align-middle">
                    {i + 1}
                  </td>
                  <td className="px-2 py-1 font-semibold align-middle">
                    {g.nombre}
                  </td>
                  <td className="px-2 py-1 text-center align-middle">
                    <span
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: 14,
                        background: g.color,
                        borderRadius: "50%",
                        border: "1px solid #888",

                        verticalAlign: "middle",
                      }}
                    ></span>
                  </td>
                  <td className="px-2 py-1 text-base font-bold text-center text-gray-800 align-middle">
                    {g.goles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Tabla de arqueros */}
        <div className="flex-1 min-w-full lg:min-w-[160px]">
          <div className="mb-2 text-sm font-bold text-center text-gray-800">
            Top 5 Arqueros
          </div>
          <table className="w-full overflow-hidden text-xs bg-white border shadow-lg rounded-2xl">
            <thead>
              <tr className="h-8 text-gray-700 bg-gray-50">
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1 text-left">Arquero</th>
                <th className="px-2 py-1 text-center">C</th>
                <th className="px-2 py-1">Goles Rec.</th>
              </tr>
            </thead>
            <tbody>
              {ARQUEROS.map((a, i) => (
                <tr
                  key={a.nombre}
                  className={`border-b last:border-b-0 ${getTopColor(i)} h-8`}
                >
                  <td className="px-2 py-1 text-base font-bold text-center align-middle">
                    {i + 1}
                  </td>
                  <td className="px-2 py-1 font-semibold align-middle">
                    {a.nombre}
                  </td>
                  <td className="px-2 py-1 text-center align-middle">
                    <span
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: 14,
                        background: a.color,
                        border: "1px solid #888",

                        borderRadius: "50%",
                        verticalAlign: "middle",
                      }}
                    ></span>
                  </td>
                  <td className="px-2 py-1 text-base font-bold text-center text-gray-800 align-middle">
                    {a.derrotas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Card de noticias de traspasos */}
      <div className="flex justify-center w-full max-w-5xl mb-8">
        <div className="flex flex-col items-center w-full p-4 text-white bg-black border border-black shadow-lg rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl text-red-600">🚫</span>
            <span className="text-base font-bold tracking-wide uppercase">
              Traspasos deshabilitados
            </span>
          </div>
          <div className="text-sm text-center text-white/90">
            Los traspasos están cerrados porque el mercado se cierra después de
            la jornada 3.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopGoleadoresArquerosTraspasos;
