import React, { useState } from "react";
import { Card } from "../common/Card";
import {
  ARQUEROS_POR_LIGA,
  LIGA_1,
  LIGA_10,
  LIGA_11,
  LIGA_12,
  LIGA_13,
  LIGA_14,
  LIGA_15,
  LIGA_2,
  LIGA_3,
  LIGA_4,
  LIGA_5,
  LIGA_6,
  LIGA_7,
  LIGA_8,
  LIGA_9,
  TEAM_COLORS,
} from "../../constants/DATOS_LIGAS";
import { getArquerosMap, getEquipoStats } from "../../utils/utilities";
import { Tabs } from "../sections/Tabs";
import { TablaGeneral } from "../sections/TablaGeneral";
import { Jornadas } from "../sections/Jornadas";
import { GoleadoresList } from "../sections/GoleadoresList";
import { ArquerosList } from "../sections/ArquerosList";
import { BracketSection } from "../sections/BracketSection";
import { LigaDropdown } from "../common/LigaDropdown";

type TabId = "clasificacion" | "goleadores" | "arqueros" | "bracket";
const TOTAL_LIGAS = 15;
const ligas = Array.from({ length: TOTAL_LIGAS }, (_, i) => i + 1);

const ClasificacionDesktop: React.FC = () => {
  const [ligaSeleccionada, setLigaSeleccionada] = useState<number>(TOTAL_LIGAS);
  const [tabSeleccionada, setTabSeleccionada] =
    useState<TabId>("clasificacion");

  const tabs: { id: TabId; label: string }[] = [
    { id: "clasificacion", label: "Clasificación" },
    { id: "goleadores", label: "Goleadores" },
    { id: "arqueros", label: "Arqueros" },
    { id: "bracket", label: "Bracket" },
  ];

  const LIGAS = [
    LIGA_1,
    LIGA_2,
    LIGA_3,
    LIGA_4,
    LIGA_5,
    LIGA_6,
    LIGA_7,
    LIGA_8,
    LIGA_9,
    LIGA_10,
    LIGA_11,
    LIGA_12,
    LIGA_13,
    LIGA_14,
    LIGA_15,
  ];

  const datosLiga: any = LIGAS[ligaSeleccionada - 1] || null;
  const arquerosEquipoMap = ARQUEROS_POR_LIGA[ligaSeleccionada] || {};
  const arquerosMap = datosLiga?.arqueros
    ? getArquerosMap(datosLiga.arqueros)
    : undefined;

  const content = (
    <div className="flex-1 h-full max-h-full pb-4 pr-2 overflow-y-auto">
      <Tabs
        tabs={tabs}
        tabSeleccionada={tabSeleccionada}
        setTabSeleccionada={(id) => setTabSeleccionada(id as TabId)}
      />
      <Card className="text-gray-900 bg-white">
        <h2 className="mb-4 text-xl font-bold">
          Clasificación Liga #{ligaSeleccionada}
        </h2>
        {datosLiga ? (
          <>
            {tabSeleccionada === "clasificacion" && (
              <>
                <div className="mb-6">
                  <h3 className="mb-2 font-semibold text-gray-700">
                    Tabla General
                  </h3>
                  <TablaGeneral
                    tablaGeneral={datosLiga.tablaGeneral}
                    TEAM_COLORS={TEAM_COLORS}
                    getEquipoStats={getEquipoStats}
                    arquerosMap={arquerosMap}
                    arquerosEquipoMap={arquerosEquipoMap}
                  />
                </div>
                <div className="mb-6">
                  <h3 className="mb-2 font-semibold text-gray-700">Jornadas</h3>
                  <Jornadas
                    jornadas={datosLiga.jornadas}
                    TEAM_COLORS={TEAM_COLORS}
                  />
                </div>
              </>
            )}
            {tabSeleccionada === "goleadores" &&
              datosLiga.goleadoresTotales && (
                <GoleadoresList
                  goleadoresTotales={datosLiga.goleadoresTotales}
                  goleadorLiga={datosLiga.goleadorLiga}
                />
              )}
            {tabSeleccionada === "arqueros" && datosLiga.arqueros && (
              <ArquerosList
                arqueros={datosLiga.arqueros}
                mejorArquero={datosLiga.mejorArquero}
                tablaGeneral={datosLiga.tablaGeneral}
                arquerosEquipoMap={arquerosEquipoMap}
                TEAM_COLORS={TEAM_COLORS}
              />
            )}
            {tabSeleccionada === "bracket" && (
              <BracketSection
                cuartos={datosLiga.cuartos}
                semifinales={datosLiga.semifinales}
                final={datosLiga.final}
                ganador={datosLiga.ganador}
                TEAM_COLORS={TEAM_COLORS}
              />
            )}
          </>
        ) : (
          <div className="text-gray-600">
            <p>
              Aquí se mostrará el progreso y la clasificación de la Liga #
              {ligaSeleccionada}.
            </p>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="hidden h-full max-h-full gap-8 md:flex">
      <div className="flex flex-col gap-4 min-w-[200px]">
        <LigaDropdown
          ligas={ligas}
          ligaSeleccionada={ligaSeleccionada}
          setLigaSeleccionada={setLigaSeleccionada}
          TOTAL_LIGAS={TOTAL_LIGAS}
        />
      </div>
      {content}
    </div>
  );
};

export default ClasificacionDesktop;
