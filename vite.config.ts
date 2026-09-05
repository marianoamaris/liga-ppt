import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        /**
         * React va en su propio trozo, y solo React.
         *
         * Todo iba junto, así que cualquier despliegue —cambiar un texto, mover
         * un botón— le cambiaba el hash a React entero y quien ya había entrado
         * se lo volvía a descargar. Aparte, un despliegue normal solo invalida
         * el trozo de la aplicación.
         *
         * Supabase y framer-motion **no** se listan aquí a propósito, aunque
         * pesen más: nombrarlos los convertía en dependencia fija del arranque
         * y la portada acababa precargando 95 KB comprimidos que no usa. Que
         * se queden fuera del inicio se resuelve donde toca —importándolos
         * solo cuando se necesitan— y no diciéndole al empaquetador dónde
         * ponerlos.
         */
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
