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

**Liga PPT** is a React + TypeScript + Vite SPA for a private indoor-football league. It is deployed to Netlify. The API lives in a sibling repo, `../liga-ppt-backend` (Express 5 + Supabase), and is reached through `VITE_API_URL`.

### Routing

`src/Router.tsx` defines all routes. Public pages are wrapped in `<Layout>`, which renders the desktop `<Sidebar>`, the mobile `<BarraInferior>` and an `<Outlet>`. `/login`, `/anotador` and `/crear-liga` sit outside the layout.

Routes carry no city segment: the active city comes from `SedeContext` (see below), not from the URL.

### Data layer

League data lives in the database, not in the repo. It is read through `src/lib/api.ts` (typed fetch wrappers) and the hooks in `src/hooks/useCatalogo.ts`. What remains in `src/constants/` is configuration, not data: navigation, sponsors, annotator settings.

The line between the two: podium *rows* (who, how much, which edition) are data and live in the database; record *labels* ("Más goles anotados en una sola liga") are UI copy and live beside the component that renders them — see the `TABS` catalogue in `src/pages/LogrosPage.tsx`.

### Sedes (cities) and edition numbering

The league runs in more than one city. This shapes the whole data model:

- `ediciones.numero` is an **internal, global key**. It is what `partidos.temporada` stores, what the eight `edicion_*` tables reference, and what every API endpoint takes as `temporada`/`:numero`.
- `ediciones.numero_sede` is the number **shown to the user**. Valledupar edition 20 and Bogotá edition 1 are `numero` 20 and 101 respectively, but both display as their `numero_sede`.
- Each sede owns a block of 100 internal numbers (`sedes.rango_base`), enforced by a trigger.

**Never render `numero`.** Use `numero_sede`, and add the sede whenever a view mixes cities — `src/utils/ediciones.ts` has `etiquetaEdicion`, `siglaSede` and `mezclaSedes` for exactly that.

`src/context/SedeContext.tsx` holds the active city and its edition in progress. `useSede()` returns `{ sede, sedeId, cambiarSede, edicionActual, numeroSede }`, where `edicionActual` is the internal key to pass to the API. The choice persists in localStorage. There is no `EDICION_ACTUAL` constant any more: opening a new edition is a database change (`node scripts/abrir-edicion.mjs <sede> --apply` in the backend repo), not a deploy.

Every view is scoped to one city and passes `sedeId` to its hooks (`useEdiciones`, `useFinales`, `usePalmares`, `useTitulos`, `useRecords`). Historical records do not mix cities: each has its own Bota de Oro, its own most-decorated players, its own podiums in `sede_records`. `jugador_palmares` carries `sede_id` inside its primary key, because the same player can win the same award in both cities.

A city with no edition in progress — or one whose edition has no teams yet — must not poll. `EnVivoPage` checks which sede the loaded teams belong to before starting its 8s refresh and its Realtime channel: on a city switch there is one render where the edition is already the new one but the teams are still the old city's, and trusting `equipos.length` alone fires a burst of requests against a league that has not started.

### Responsive pattern

Layout is handled with Tailwind breakpoints in a single component per view — mobile-first, `md:` upwards for desktop. There are no `Desktop`/`Tablet`/`Mobile` sibling components.

### Player identity

Player names appear across sources with inconsistent spellings, so the padrón is keyed by `slug` and alternative spellings resolve through the `jugador_alias` table. **Never join players by raw name.** The registry is shared across cities: a player who moves keeps one identity, with membership rows in `jugador_sedes`.

### Images

- **Player photos** — `src/utils/fotosJugadores.ts` globs `src/assets/FOTOS_JUGADORES/`. Prefer `fotoJugadorPorArchivo(jugador.foto_archivo)`, which uses the filename the database records, over name-based lookup.
- **Jerseys** — `src/utils/imagenesEquipos.ts` globs `src/assets/CAMISETAS/<sede>/<numero_sede>/<Color>.png`, e.g. `CAMISETAS/vup/20/Amarillo.png`. Note the folder uses the *visible* edition number, not the internal key. When `color_slug` is missing, the colour is inferred from the team's hex.

### Navigation

`src/constants/navegacion.ts` drives both `<Sidebar>` (desktop) and `<BarraInferior>` (mobile), grouped by how often each destination is used. The first group is what fits in the mobile bottom bar; the rest lives behind «Más». `<SelectorSede>` renders in both, and hides itself when there is only one city.
