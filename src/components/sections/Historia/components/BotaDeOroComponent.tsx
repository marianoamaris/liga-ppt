import { BOTA_DE_ORO } from "../../../../constants/BOTA_DE_ORO";

const BotaDeOroComponent = () => {
  return (
    <div className="overflow-x-auto">
      <h2 className="mb-4 text-2xl font-extrabold text-center text-gray-800">
        Bota de oro
      </h2>
      <table className="min-w-full overflow-hidden text-sm text-left border border-gray-200 shadow-lg rounded-xl">
        <thead className="text-white bg-gradient-to-r from-yellow-700 to-yellow-400">
          <tr>
            <th className="px-4 py-3 text-lg">#</th>
            <th className="px-4 py-3 text-lg">Nombre</th>
            <th className="px-4 py-3 text-lg">Premios</th>
          </tr>
        </thead>
        <tbody>
          {BOTA_DE_ORO.map((g, idx) => {
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
                <td className="px-4 py-2 text-lg">{medal || idx + 1}</td>
                <td className="px-4 py-2">{g.nombre}</td>
                <td className="px-4 py-2 font-bold">{g.premios}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4 text-sm italic text-center text-gray-600">
        La <b>Bota de oro</b> se otorga al jugador que más veces ha sido máximo
        goleador en una liga a lo largo de la historia de la Liga PPT.
      </p>
    </div>
  );
};

export default BotaDeOroComponent;
