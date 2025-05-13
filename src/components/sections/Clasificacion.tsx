import React, { useState } from "react";
import { Card } from "../common/Card";
import {
  ARQUEROS_POR_LIGA,
  LIGA_1,
  LIGA_10,
  LIGA_11,
  LIGA_12,
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
import { LigaSidebar } from "./LigaSidebar";
import { Tabs } from "./Tabs";
import { TablaGeneral } from "./TablaGeneral";
import { Jornadas } from "./Jornadas";
import { GoleadoresList } from "./GoleadoresList";
import { ArquerosList } from "./ArquerosList";
import { BracketSection } from "./BracketSection";

const TOTAL_LIGAS = 13;
const ligas = Array.from({ length: TOTAL_LIGAS }, (_, i) => i + 1);
type TabId = "clasificacion" | "goleadores" | "arqueros" | "bracket";

export const Clasificacion: React.FC = () => {
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
  ];

  const datosLiga: any = LIGAS[ligaSeleccionada - 1] || null;
  const arquerosEquipoMap = ARQUEROS_POR_LIGA[ligaSeleccionada] || {};
  const arquerosMap = datosLiga?.arqueros
    ? getArquerosMap(datosLiga.arqueros)
    : undefined;

  return (
    <div className="flex h-full max-h-full gap-8">
      <LigaSidebar
        ligas={ligas}
        ligaSeleccionada={ligaSeleccionada}
        setLigaSeleccionada={setLigaSeleccionada}
        TOTAL_LIGAS={TOTAL_LIGAS}
      />
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
                    <h3 className="mb-2 font-semibold text-gray-700">
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
    </div>
  );
};
