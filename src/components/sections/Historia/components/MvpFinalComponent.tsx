import { MVP_FINAL } from "../../../../constants/MVP_FINAL";

const MvpFinalComponent = () => {
  return (
    <div className="overflow-x-auto">
      <h2 className="mb-4 text-2xl font-extrabold text-center text-gray-800">
        MVP de la final
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
          {MVP_FINAL.map((g) => {
            let rowClass = "bg-yellow-100 font-bold text-yellow-800";
            let medal = "🥇";
            return (
              <tr
                key={g.nombre}
                className={
                  rowClass +
                  " border-t border-gray-100 transition-all hover:bg-yellow-50"
                }
              >
                <td className="px-4 py-2 text-lg">{medal}</td>
                <td className="px-4 py-2">{g.nombre}</td>
                <td className="px-4 py-2 font-bold">{g.premios}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4 text-sm italic text-center text-gray-600">
        El <b>MVP de la final</b> se otorga al jugador más determinante y
        valioso durante el partido más importante de la temporada.
      </p>
    </div>
  );
};

export default MvpFinalComponent;
