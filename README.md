# UniLink

Bilingual (EN/AR) university & program discovery platform for Egypt — **Phase 1** (public discovery), built on the recommended stack from [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md).

> This is a runnable Phase 1 MVP backed by **dummy data**. The mock data layer is deliberately shaped like the future API so it can be swapped for the real Postgres/PostGIS + NestJS backend without touching the UI. See [Migration path](#migration-path-mock--real-backend).

## What's implemented (Phase 1 / the SRS)

- **Landing page** — hero bilingual search, field-of-study chips, find-near-me, featured universities, stats, how-it-works (SSR/SSG for SEO).
- **Bilingual search** — matches `name_en`/`name_ar` with **Arabic normalization** (أ/ا/إ, ة/ه, ى/ي), 300 ms-debounced autocomplete, grouped results.
- **Filters & sorting** — Field of Study, Degree Type, Tuition Fee buckets (EGP), Location, National/International; combinable; sort by fees / name / distance. State lives in the URL.
- **University profiles** — SSG per slug, faculty → department → program hierarchy, fees/degree/duration, verification badge, embedded location map.
- **Find near me** — browser geolocation, adjustable radius (5/10/25/50 km), distance labels, graceful denied/unsupported fallback (manual city).
- **Interactive map** — MapLibre GL with clustered branded markers, popups, user-location marker + radius, viewport "search this area", list⇄map layout.
- **Reference API** — read-only endpoints mirroring the SRS contract (see below).
- **Localization** — instant EN↔AR toggle with full **RTL**, persisted via cookie; four bilingual fonts (Plus Jakarta Sans / Inter · Cairo / IBM Plex Sans Arabic).

## Stack

Turborepo · pnpm · **Next.js 16 (App Router) + React 19 + TypeScript** · Tailwind CSS v4 · MapLibre GL (keyless OSM tiles for now) · custom lightweight i18n. Design tokens come straight from the UniLink UI kit (brand `#0047FF`, accent `#F82C1F`).

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000  → redirects to /en
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint` (run from the repo root; Turbo fans out to `apps/*`).

## Structure

```
UniLink/
├─ apps/
│  └─ web/                        # Next.js Phase 1 app
│     └─ src/
│        ├─ app/[locale]/         # localized routes: landing, search, universities/[slug], map
│        ├─ app/api/              # reference REST endpoints (over mock data)
│        ├─ components/           # Header, SearchBar, Filters, UniversityCard, MapView, …
│        ├─ data/                 # DUMMY DATA: universities, fields, fee-buckets
│        ├─ lib/                  # catalog (search/filter/geo), normalize, geo, format, types
│        ├─ i18n/                 # config, messages (en/ar), provider
│        └─ proxy.ts              # locale routing (Next 16 "proxy", was middleware)
├─ docs/                          # PROJECT_PLAN.md, TECH_STACK, FIGMA_AI_PROMPT.md
├─ turbo.json · pnpm-workspace.yaml
└─ (later) apps/api/  packages/*  # NestJS backend + shared packages
```

## Reference API

All read-only; accept `lang=en|ar`, support pagination, return JSON.

| Endpoint | Purpose |
|---|---|
| `GET /api/search` | Unified grouped search |
| `GET /api/autocomplete` | Type-ahead suggestions |
| `GET /api/universities` | List/filter universities |
| `GET /api/universities/{slug}` | Single university profile |
| `GET /api/programs` | List/filter programs |
| `GET /api/universities/nearby` | Within radius of a point (`lat,lng,radius_km`) |
| `GET /api/universities/within` | Within a map viewport (bbox) |
| `GET /api/fields` · `GET /api/fee-buckets` | Controlled vocabularies |

## Migration path (mock → real backend)

The UI reads data through `src/lib/catalog.ts` and the `/api/*` route handlers only. To move off dummy data:

1. Stand up `apps/api` (NestJS) + Postgres/PostGIS, seed the same schema (`src/lib/types.ts` mirrors the SRS entities).
2. Point the route handlers / server components at the NestJS API (or proxy `/api/*` to it).
3. Swap search/autocomplete to Meilisearch and geo queries to PostGIS `ST_DWithin` / bbox — same request/response shapes, so components are unchanged.
4. Replace the keyless OSM tile style in `MapView.tsx` with MapTiler vector tiles + a referrer-restricted key.

## Notes / demo limitations

- **Dummy data** — 12 sample Egyptian universities in `src/data/`.
- **Map tiles** are keyless OpenStreetMap raster (fine for dev; use MapTiler in prod).
- React Strict Mode's dev double-invoke is disabled (`next.config.ts`) so MapLibre isn't torn down/rebuilt each mount.
- Auth, applications, payments, dashboards, CRM, etc. are **later phases** — see the plan.
