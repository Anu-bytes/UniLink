# UniLink

Web platform connecting students with universities and study-abroad programs.

## Tech stack

- **Next.js 16** (App Router, React 19) — `apps/web`
- **Prisma 6** + **PostgreSQL** — database & ORM
- **Auth.js (NextAuth v5)** — credentials + Google OAuth
- **next-intl** — i18n with English & Arabic (RTL) locales
- **Tailwind CSS v4** + **shadcn / Base UI** — styling & components
- **npm workspaces** — monorepo (`apps/*`)

## Repository layout

```
unilink-workspace/
├─ apps/
│  └─ web/            # Next.js app (frontend + API routes)
│     ├─ prisma/      # schema.prisma + migrations
│     ├─ messages/    # i18n translation files (en.json, ar.json)
│     ├─ public/      # static assets
│     └─ src/         # app code (app/, components/, lib/, i18n/)
├─ compose.yaml       # local PostgreSQL via Docker
└─ package.json       # workspace root scripts
```

## Getting started

### 1. Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL) — or a hosted Postgres connection string

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example env files and fill in your own values:

```bash
cp .env.example .env                     # database creds for docker compose
cp apps/web/.env.example apps/web/.env    # app config (DATABASE_URL, AUTH_SECRET, OAuth)
```

Generate an auth secret with:

```bash
npx auth secret
```

> **Never commit `.env` files** — they hold real credentials and are gitignored.

For hosted Supabase, use the two connection strings shown by **Supabase Dashboard > Connect**:

- `DATABASE_URL`: transaction pooler on port `6543`, used by the running app
- `DIRECT_URL`: session pooler on port `5432`, used by Prisma migrations

Keeping these separate prevents schema migrations from running through transaction pooling. Use placeholders in committed files and keep real credentials only in `apps/web/.env`.

### 4. Start the database

```bash
docker compose up -d db
```

Skip this step when using Supabase.

### 5. Set up the schema

```bash
npm run db:migrate     # apply migrations
```

### 6. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Scripts (run from repo root)

| Command | Description |
|---|---|
| `npm run dev` | Start the web dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Lint the web app |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Create & apply a dev migration |
| `npm run db:studio` | Open Prisma Studio |
