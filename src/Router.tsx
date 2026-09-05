import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/common/Layout";

/**
 * Todo menos la portada se carga cuando se visita.
 *
 * Antes la aplicación entera iba en un solo archivo de 812 KB: quien entraba a
 * ver la tabla se descargaba también el anotador, el asistente de crear liga y
 * las seis pantallas que no iba a abrir. La portada es lo único que se pide
 * siempre, así que es lo único que sigue yendo por delante.
 *
 * `Suspense` envuelve solo el contenido, no el layout: la barra lateral y la
 * inferior son las mismas en todas las rutas y no deben parpadear al navegar.
 */
const Contacto = lazy(() => import("./pages/Contacto").then((m) => ({ default: m.Contacto })));
const Clasificacion = lazy(() =>
  import("./components/sections/Clasificacion").then((m) => ({ default: m.Clasificacion }))
);
const Historia = lazy(() =>
  import("./components/sections/Historia/Historia").then((m) => ({ default: m.Historia }))
);
const SignIn = lazy(() => import("./components/Auth/SignIn").then((m) => ({ default: m.SignIn })));
const LogrosPage = lazy(() =>
  import("./pages/LogrosPage").then((m) => ({ default: m.LogrosPage }))
);
const AnunciosPage = lazy(() =>
  import("./pages/AnunciosPage").then((m) => ({ default: m.AnunciosPage }))
);
const PatrocinadoresPage = lazy(() =>
  import("./pages/PatrocinadoresPage").then((m) => ({ default: m.PatrocinadoresPage }))
);
const ActualizacionDatosJugadorPage = lazy(() =>
  import("./pages/ActualizacionDatosJugadorPage").then((m) => ({
    default: m.ActualizacionDatosJugadorPage,
  }))
);
const AnotadorPage = lazy(() =>
  import("./pages/AnotadorPage").then((m) => ({ default: m.AnotadorPage }))
);
const CrearLigaPage = lazy(() =>
  import("./pages/CrearLigaPage").then((m) => ({ default: m.CrearLigaPage }))
);
const EnVivoPage = lazy(() =>
  import("./pages/EnVivoPage").then((m) => ({ default: m.EnVivoPage }))
);

/** Lo que se ve mientras llega el trozo de la ruta. Dura milisegundos. */
const Cargando = () => (
  <div className="min-h-full bg-ink px-4 py-6">
    <p className="font-cond text-sm text-chalk-3">Cargando…</p>
  </div>
);

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Cargando />}>
      <Routes>
        {/* Rutas públicas con layout (datos estáticos, sin auth) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/clasificacion" element={<Clasificacion />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/logros" element={<LogrosPage />} />
          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/patrocinadores" element={<PatrocinadoresPage />} />
          <Route path="/participa-en-la-liga-ppt" element={<ActualizacionDatosJugadorPage />} />

          {/* En Vivo es pública — cualquiera puede ver los partidos */}
          <Route path="/en-vivo" element={<EnVivoPage />} />
        </Route>

        {/* Sin layout */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/anotador" element={<AnotadorPage />} />
        <Route path="/crear-liga" element={<CrearLigaPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
