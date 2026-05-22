# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check + Vite production build (output: dist/)
npm run lint       # ESLint
npm run preview    # Preview the production build locally
```

There is no test suite.

## Architecture

**Liga PPT** is a React + TypeScript + Vite SPA for managing and displaying a private football league (PPT). It is deployed to Netlify.

### Routing

`src/Router.tsx` defines all routes. All public pages are wrapped in `<Layout>` (which renders the global Sidebar + `<Outlet>`). `/login` and `/privado` are outside the layout.

### Data layer

All league data lives as plain TypeScript constants in `src/constants/`:

- `liga18.ts` / `liga19.ts` — per-edition data: `tablaGeneral`, `jornadas`, `goleadoresTotales`, `arqueros`, bracket fields (`cuartos`, `semifinales`, `final`, `ganador`).
- `DATOS_LIGAS.ts` — `TEAM_COLORS` map (team name → hex or `[hex, hex]` gradient) shared across editions.
- `theme.ts` — `THEME` (design tokens) and `SIDEBAR_ITEMS` (nav config consumed by `<Sidebar>`).
- Historical records live in separate files: `BOTA_DE_ORO.ts`, `GUANTE_DE_ORO.ts`, `GOLEADORES_HISTORICOS.ts`, `MVP_LIGA.ts`, `MVP_FINAL.ts`, `HISTORICO_FINALES.ts`, `CAPITANES_HISTORICOS.ts`, `GANADORES.ts`.

To update a league edition, edit the relevant `liga<N>.ts` constants file. To add a new edition, create `liga<N>.ts` following the same shape and wire it into `Clasificacion` and `Home`.

### Responsive pattern

Major sections have three sibling components suffixed `Desktop`, `Tablet`, and `Mobile`. The section entry point (e.g. `src/components/sections/Clasificacion.tsx`) uses `react-responsive`'s `useMediaQuery` to pick the right one at runtime:

- mobile: `maxWidth: 639`
- tablet: `minWidth: 640, maxWidth: 1023`
- desktop: `minWidth: 1024`

There is also a custom `useBreakpoint` hook (`src/hooks/useBreakpoint.ts`) that returns `"mobile" | "tablet" | "desktop"` via a resize listener. Use `react-responsive` for render-path splitting and `useBreakpoint` for imperative logic.

### Player photos

`src/utils/fotosJugadores.ts` resolves player photos via `import.meta.glob` over `src/assets/FOTOS_JUGADORES/`. It normalises names (strips accents, punctuation) and supports an `ALIASES` map for nickname mismatches. Add new photos by dropping a PNG into that folder; file name must match the player's display name (after normalisation). Files matching `(1)` are skipped as duplicates.

### Sidebar

`src/components/common/Sidebar.tsx` is driven by `SIDEBAR_ITEMS` in `theme.ts`. On desktop it is always visible; on mobile it slides in as a full-screen overlay toggled by a hamburger button rendered in `Layout.tsx`.
