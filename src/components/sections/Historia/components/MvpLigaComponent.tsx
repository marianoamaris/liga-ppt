import { MVP_LIGA } from "../../../../constants/MVP_LIGA";

const MvpLigaComponent = () => {
  return (
    <div className="overflow-x-auto">
      <h2 className="mb-4 text-2xl font-extrabold text-center text-gray-800">
        MVP de la liga
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
          {MVP_LIGA.map((g, idx) => {
            const maxPremios = MVP_LIGA[0].premios;
            const secondPremios = MVP_LIGA.find(x => x.premios < maxPremios)?.premios ?? 0;
            const thirdPremios = MVP_LIGA.find(x => x.premios < secondPremios)?.premios ?? 0;

            let rowClass = "";
            let medal = "";
            if (g.premios === maxPremios) {
              rowClass = "bg-yellow-100 font-bold text-yellow-800";
              medal = "🥇";
            } else if (g.premios === secondPremios) {
              rowClass = "bg-gray-100 font-semibold text-gray-700";
              medal = "🥈";
            } else if (g.premios === thirdPremios) {
              rowClass = "bg-orange-100 font-semibold text-orange-800";
              medal = "🥉";
            } else if (idx % 2 === 0) {
              rowClass = "bg-white";
            } else {
              rowClass = "bg-gray-50";
            }
            return (
              <tr
                key={g.nombre}
                className={rowClass + " border-t border-gray-100 transition-all hover:bg-yellow-50"}
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
        El <b>MVP de la liga</b> se otorga al jugador más valioso de la
        temporada regular, seleccionado por su rendimiento y aporte al equipo.
      </p>
    </div>
  );
};

export default MvpLigaComponent;
