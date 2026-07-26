import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BarraInferior } from "./BarraInferior";

/**
 * Estructura común de las páginas públicas.
 *
 * El fondo y el espaciado los pone cada página: unas ya están migradas al tema
 * oscuro y otras todavía traen sus tarjetas claras.
 */
export const Layout: React.FC = () => (
  <div className="flex h-dvh overflow-hidden bg-ink">
    <Sidebar className="hidden md:flex" />

    <main className="min-w-0 flex-1 overflow-y-auto pb-[3.75rem] md:pb-0">
      <Outlet />
    </main>

    <BarraInferior />
  </div>
);
