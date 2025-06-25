import React, { useState, useEffect, useCallback } from "react";
import { SidebarReglamento } from "../components/reglamento/SidebarReglamento";
import { ReglamentoViewer } from "../components/reglamento/ReglamentoViewer";

export const ReglamentoPage: React.FC = () => {
  // Para resaltar la sección activa
  const [activeId, setActiveId] = useState<string>("1. Información General");

  // Scroll listener para resaltar sección activa (fluido)
  useEffect(() => {
    const handleScroll = () => {
      const sections = Array.from(
        document.querySelectorAll("[data-section-id]")
      );
      let minDist = Infinity;
      let current = "1. Información General";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const dist = Math.abs(rect.top - 100); // 100px desde el top
        if (dist < minDist) {
          minDist = dist;
          current = section.getAttribute("data-section-id") || current;
        }
      });
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Al clickear en el sidebar, hacer scroll y actualizar el activeId
  const handleSectionClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }, []);

  return (
    <div className="flex flex-col w-full gap-0 md:flex-row md:gap-8">
      {/* SidebarReglamento solo para esta página, sticky en desktop */}
      <div className="md:w-72 w-full md:sticky md:top-0 md:h-[calc(100vh-0px)] bg-white border-r border-gray-200 z-10">
        <SidebarReglamento
          activeId={activeId}
          onSectionClick={handleSectionClick}
        />
      </div>
      <main className="flex-1 max-w-3xl p-4 mx-auto md:p-8">
        <div className="p-4 mb-6 font-medium text-center text-blue-900 bg-blue-100 rounded shadow">
          Usa el menú para navegar por el reglamento
        </div>
        <ReglamentoViewer />
      </main>
    </div>
  );
};
