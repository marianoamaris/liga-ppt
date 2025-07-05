import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Contacto } from "./pages/Contacto";
import { Clasificacion } from "./components/sections/Clasificacion";
import { Historia } from "./components/sections/Historia/Historia";
import { SignIn } from "./components/Auth/SignIn";
import { Home } from "./pages/Home";
import { Layout } from "./components/common/Layout";
import { ReglamentoPage } from "./pages/ReglamentoPage";
import { LogrosPage } from "./pages/LogrosPage";
import { AnunciosPage } from "./pages/AnunciosPage";
import { CalendarioPage } from "./pages/CalendarioPage";

// Placeholder para rutas privadas
const PrivatePlaceholder = () => (
  <div className="p-8 text-center text-gray-700">
    Zona privada (próximamente)
  </div>
);

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas con layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/reglamento" element={<ReglamentoPage />} />
        <Route path="/logros" element={<LogrosPage />} />
        <Route path="/anuncios" element={<AnunciosPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
      </Route>
      {/* Rutas públicas sin layout */}
      <Route path="/login" element={<SignIn />} />
      {/* Rutas privadas (placeholder) */}
      <Route path="/privado" element={<PrivatePlaceholder />} />
      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
