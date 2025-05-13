import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./Router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);

if (typeof document !== "undefined") {
  document.title = "Liga PPT";
  const favicon =
    document.querySelector("link[rel='icon']") ||
    document.createElement("link");
  favicon.setAttribute("rel", "icon");
  favicon.setAttribute("type", "image/png");
  favicon.setAttribute("href", "/src/assets/ligaPPT-escudo.png");
  document.head.appendChild(favicon);
}
