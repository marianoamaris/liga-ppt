import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./Router";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>
);

if (typeof document !== "undefined") {
  document.title = "Liga PPT";
  const favicon =
    document.querySelector("link[rel='icon']") ||
    document.createElement("link");
  favicon.setAttribute("rel", "icon");
  favicon.setAttribute("type", "image/png");
  favicon.setAttribute("href", "/PPT.png");

  document.head.appendChild(favicon);
}
