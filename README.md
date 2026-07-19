# UniLink

UniLink is a bilingual English/Arabic platform for discovering universities,
comparing programs, exploring campuses on a map, and building a personalized
student profile for future admissions matching.

This branch combines the strongest parts of the original `main` and
`preproduction` implementations while preserving both Git histories.

## What is included

- University and program search with Arabic normalization, filters, sorting,
  autocomplete, and URL-backed state.
- University profile pages with program hierarchies, fees, verification, and
  location maps.
- Nearby and viewport search with MapLibre.
- English and Arabic interfaces with RTL support.
- A polished, localized onboarding flow and reusable UI component system.
- Auth.js credentials and Google authentication.
- Prisma and PostgreSQL persistence for users and student profiles.
- Docker Compose configuration for local PostgreSQL.
- Reference catalog APIs backed by the existing Phase 1 sample data.

## Stack

Turborepo · pnpm · Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 ·
MapLibre · next-intl · Auth.js · Prisma · PostgreSQL

## Getting started

Prerequisites: Node.js 20+, pnpm 9.15, and Docker or another PostgreSQL server.

```bash
cp .env.example .env
cp .env.example apps/web/.env
docker compose up -d db
pnpm install
pnpm db:migrate
pnpm dev
```

Open `http://localhost:3000`; locale routing redirects to `/en` or `/ar`.

For Google login, set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`. Credentials
login works without Google OAuth after the database and `AUTH_SECRET` are set.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the web application |
| `pnpm build` | Generate Prisma Client and build production assets |
| `pnpm lint` | Run ESLint |
| `pnpm db:migrate` | Create/apply local migrations |
| `pnpm db:deploy` | Apply committed migrations in deployment |
| `pnpm db:studio` | Open Prisma Studio |

## Current data boundary

Discovery pages still use the shaped Phase 1 catalog in `apps/web/src/data`.
Authentication and onboarding profiles use PostgreSQL. This keeps the complete
discovery demo runnable while providing a production-oriented persistence path.
The catalog layer can later be moved to Prisma without changing page contracts.
