import { GOLEADORES_HISTORICOS } from "../../../../constants/GOLEADORES_HISTORICOS";

const HistoricoGoleadoresComponent = () => {
  return (
    <div className="overflow-x-auto">
      <h2 className="mb-4 text-2xl font-extrabold text-center text-gray-800">
        Goleadores históricos
      </h2>
      <table className="min-w-full overflow-hidden text-sm text-left border border-gray-200 shadow-lg rounded-xl">
        <thead className="text-white bg-gradient-to-r from-yellow-700 to-yellow-400">
          <tr>
            <th className="px-4 py-3 text-lg">#</th>
            <th className="px-4 py-3 text-lg">Nombre</th>
            <th className="px-4 py-3 text-lg">Goles</th>
          </tr>
        </thead>
        <tbody>
          {GOLEADORES_HISTORICOS.map((g, idx) => {
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
                  rowClass + " border-t border-gray-100 transition-all "
                }
              >
                <td className="px-4 py-2 text-lg">{medal || idx + 1}</td>
                <td className="px-4 py-2">{g.nombre}</td>
                <td className="px-4 py-2 font-bold">{g.goles}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricoGoleadoresComponent;
