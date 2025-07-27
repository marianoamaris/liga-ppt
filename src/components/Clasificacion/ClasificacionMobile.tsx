import React, { useState } from "react";
import {
  ARQUEROS_POR_LIGA,
  LIGA_1,
  LIGA_10,
  LIGA_11,
  LIGA_12,
  LIGA_13,
  LIGA_14,
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
const TOTAL_LIGAS = 14;
const ligas = Array.from({ length: TOTAL_LIGAS }, (_, i) => i + 1);

const ClasificacionMobile: React.FC = () => {
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
  ];

  const datosLiga: any = LIGAS[ligaSeleccionada - 1] || null;
  const arquerosEquipoMap = ARQUEROS_POR_LIGA[ligaSeleccionada] || {};
  const arquerosMap = datosLiga?.arqueros
    ? getArquerosMap(datosLiga.arqueros)
    : undefined;

  return (
    <div className="flex flex-col w-screen min-h-screen gap-4 bg-gray-100 max-w-none">
      {/* Dropdown de ligas */}
      <div className="sticky top-0 z-10 p-4 bg-white border-b border-gray-200">
        <LigaDropdown
          ligas={ligas}
          ligaSeleccionada={ligaSeleccionada}
          setLigaSeleccionada={setLigaSeleccionada}
          TOTAL_LIGAS={TOTAL_LIGAS}
        />
      </div>
      {/* Tabs */}
      <div className="w-full px-4 bg-white border-b border-gray-200">
        <Tabs
          tabs={tabs}
          tabSeleccionada={tabSeleccionada}
          setTabSeleccionada={(id) => setTabSeleccionada(id as TabId)}
        />
      </div>
      {/* Contenido principal */}
      <div className="flex flex-col flex-1 w-full gap-6 px-4 pb-8">
        <div className="w-full">
          <h2 className="mt-8 mb-4 text-xl font-bold">
            Clasificación Liga #{ligaSeleccionada}
          </h2>
          {datosLiga ? (
            <>
              {tabSeleccionada === "clasificacion" && (
                <>
                  <div className="w-full mb-6 overflow-x-auto">
                    <h3 className="mb-3 text-base font-semibold text-gray-700">
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
                  <div className="w-full mb-6">
                    <h3 className="mb-3 text-base font-semibold text-gray-700">
                      Jornadas
                    </h3>
                    <Jornadas
                      jornadas={datosLiga.jornadas}
                      TEAM_COLORS={TEAM_COLORS}
                    />
                  </div>
                </>
              )}
              {tabSeleccionada === "goleadores" &&
                datosLiga.goleadoresTotales && (
                  <div className="w-full">
                    <GoleadoresList
                      goleadoresTotales={datosLiga.goleadoresTotales}
                      goleadorLiga={datosLiga.goleadorLiga}
                    />
                  </div>
                )}
              {tabSeleccionada === "arqueros" && datosLiga.arqueros && (
                <div className="w-full">
                  <ArquerosList
                    arqueros={datosLiga.arqueros}
                    mejorArquero={datosLiga.mejorArquero}
                    tablaGeneral={datosLiga.tablaGeneral}
                    arquerosEquipoMap={arquerosEquipoMap}
                    TEAM_COLORS={TEAM_COLORS}
                  />
                </div>
              )}
              {tabSeleccionada === "bracket" && (
                <div className="w-full">
                  <BracketSection
                    cuartos={datosLiga.cuartos}
                    semifinales={datosLiga.semifinales}
                    final={datosLiga.final}
                    ganador={datosLiga.ganador}
                    TEAM_COLORS={TEAM_COLORS}
                  />
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default ClasificacionMobile;
