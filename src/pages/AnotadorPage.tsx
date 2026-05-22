import { useState } from "react";
import { PinGuard } from "../components/anotador/PinGuard";
import { SetupJornada } from "../components/anotador/SetupJornada";
import { PartidoEnVivo } from "../components/anotador/PartidoEnVivo";
import { ResumenPartido } from "../components/anotador/ResumenPartido";
import type {
  Evento,
  PartidoConfig,
  PartidoVivo,
} from "../components/anotador/types";

type Phase = "pin" | "setup" | "live" | "resumen";

const EVENTOS_VACIO: Evento[] = [];

export function AnotadorPage() {
  const [phase, setPhase] = useState<Phase>("pin");
  const [partido, setPartido] = useState<PartidoVivo | null>(null);

  function handleIniciar(config: PartidoConfig) {
    setPartido({ config, eventos: EVENTOS_VACIO, iniciadoEn: Date.now() });
    setPhase("live");
  }

  function handleNuevoPartido() {
    setPartido(null);
    setPhase("setup");
  }

  if (phase === "pin") {
    return <PinGuard onSuccess={() => setPhase("setup")} />;
  }

  if (phase === "setup") {
    return <SetupJornada onIniciar={handleIniciar} />;
  }

  if (phase === "live" && partido) {
    return (
      <PartidoEnVivo
        partido={partido}
        onUpdatePartido={setPartido}
        onFinalizar={() => setPhase("resumen")}
      />
    );
  }

  if (phase === "resumen" && partido) {
    return (
      <ResumenPartido partido={partido} onNuevoPartido={handleNuevoPartido} />
    );
  }

  return null;
}
