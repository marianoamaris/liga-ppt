export function getEquipoStats(
  equipo: string,
  row: any,
  arquerosMap: Record<string, number>,
  arquerosEquipoMap: Record<string, string>
) {
  const victorias = row.victorias || 0;
  const empates = row.empates || 0;
  // Buscar el nombre del arquero para este equipo
  const arquero = arquerosEquipoMap[equipo];
  const derrotas =
    arquero && arquerosMap[arquero] !== undefined
      ? String(arquerosMap[arquero])
      : "-";
  const partidosJugados = String(
    victorias + empates + (derrotas !== "-" ? Number(derrotas) : 0)
  );
  const porcentajeVictoria =
    Number(partidosJugados) > 0
      ? ((victorias / Number(partidosJugados)) * 100).toFixed(1)
      : "-";
  return { partidosJugados, derrotas, porcentajeVictoria };
}

export function getArquerosMap(arqueros: any[]) {
  const map: Record<string, number> = {};
  arqueros.forEach((a) => {
    map[a.arquero] = a.golesRecibidos;
  });
  return map;
}
