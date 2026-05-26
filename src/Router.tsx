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
import { PatrocinadoresPage } from "./pages/PatrocinadoresPage";
import { ActualizacionDatosJugadorPage } from "./pages/ActualizacionDatosJugadorPage";
import { AnotadorPage } from "./pages/AnotadorPage";
import { EnVivoPage } from "./pages/EnVivoPage";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas con layout (datos estáticos, sin auth) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/reglamento" element={<ReglamentoPage />} />
        <Route path="/logros" element={<LogrosPage />} />
        <Route path="/anuncios" element={<AnunciosPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/patrocinadores" element={<PatrocinadoresPage />} />
        <Route path="/participa-en-la-liga-ppt" element={<ActualizacionDatosJugadorPage />} />

        {/* En Vivo es pública — cualquiera puede ver los partidos */}
        <Route path="/en-vivo" element={<EnVivoPage />} />
      </Route>

      {/* Sin layout */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/anotador" element={<AnotadorPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
