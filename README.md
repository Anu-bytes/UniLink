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
│     ├─ prisma/      # schema.prisma, migrations, seed/
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
npm run db:seed        # load the Egyptian university catalogue
```

The seed is idempotent and only touches the universities it owns (matched by
slug), so it is safe to re-run after editing `apps/web/prisma/seed/data.ts`.

### 6. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Main surfaces

| Route | What it is |
|---|---|
| `/{locale}/universities` | Public directory of published universities |
| `/{locale}/universities/[slug]` | University profile: gallery hero plus the About / Faculties / Location / Admission Requirements / Admission Criteria / Minimum Scores / Tuition Fees tabs (`?tab=` is linkable) |
| `/{locale}/universities/[slug]/programs/[programSlug]` | Program profile |
| `/{locale}/app/search` | Signed-in program search: natural-language search bar, filters, match-scored result cards |
| `/{locale}/app/compare` | Side-by-side comparison of up to four programs |
| `/{locale}/app/applications`, `/app/saved`, `/app/profile` | Student workspace |
| `/{locale}/admin` | Admin dashboard: catalogue, people, growth (see below) |

Everything under `/{locale}/app` requires a session; `src/proxy.ts` redirects
anonymous visitors to `/login`.

## Admin dashboard

`/{locale}/admin` is the back office. It is bilingual and RTL-aware like the
rest of the site, but styled as its own surface — dark sidebar, light content —
so there is never a doubt about which side of the product you are on.

| Section | Route | What it manages |
|---|---|---|
| Overview | `/admin` | Counts across the catalogue, people and leads, plus the newest applications, sign-ups and partnership leads |
| Universities | `/admin/universities` | The university record and its gallery images, feature bullets, tab content blocks and minimum scores |
| Faculties | `/admin/faculties` | Faculties under each university |
| Programs | `/admin/programs` | Programs, their intakes and their English requirements |
| Users | `/admin/users` | Accounts, roles and the onboarding profile behind each one |
| Applications | `/admin/applications` | Every student application and its status |
| Leads | `/admin/leads` | Partnership requests submitted from `/contact` |
| Testimonials | `/admin/testimonials` | Home-page testimonials |
| Scholarships | `/admin/scholarships` | Scholarship listings |

### Access

`User.role` decides. Three layers guard the surface, because one is not enough:

1. `src/proxy.ts` sends anonymous visitors to `/login`. It only sees the session
   cookie, so it cannot tell an admin from a student.
2. The admin layout calls `getAdminActor()`, which re-reads the row. A signed-in
   non-admin gets a 404 rather than a "forbidden" page — nothing links here, so
   confirming the route exists would only help someone guessing.
3. Every `/api/admin/*` handler independently calls `requireAdmin()`.

The role is also mirrored onto the session token for the navigation to read, but
that copy is refreshed at most once a minute and is never the authority. Layers 2
and 3 read the database, so removing someone's access takes effect on their very
next click.

### Creating the first administrator

Nobody can be promoted from inside the dashboard until somebody is already in it,
so the first admin is made from the command line:

```bash
npm run db:seed:admin -- you@example.com                    # promote or create
npm run db:seed:admin -- you@example.com 'a-strong-password'
```

An existing account is promoted and its password left alone. A missing account is
created, and a generated password is printed once. There is deliberately no
default email or password baked into the repository.

### Endpoints

`src/app/api/admin/*` follows the same shape as the existing routes
(`api/saved`, `api/applications`): a `route.ts` per resource exporting named HTTP
methods, zod for the body, `NextResponse.json` for the reply. The shared pieces
live in `src/lib/admin.ts` (the guard) and `src/lib/admin-api.ts` (pagination,
`{ error, field }` responses, Prisma error mapping).

Lists accept `?page`, `?perPage`, `?q`, `?sort`, `?order` plus per-resource
filters, and answer with `{ items, page, perPage, total, totalPages }`. Deletes
that cascade — a university, a faculty, a program, a user — require an explicit
`?confirm=true`, and answer 409 with the row counts at stake when it is missing.

Image uploads go to `POST /api/admin/media` (multipart, `file` + `folder`), which
validates the bytes by signature exactly as the avatar route does and stores them
in the `media` bucket. With Supabase unset, the image fields fall back to pasting
a URL.

## Scripts (run from repo root)

| Command | Description |
|---|---|
| `npm run dev` | Start the web dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Lint the web app |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Create & apply a dev migration |
| `npm run db:seed` | Seed the university / faculty / program catalogue |
| `npm run db:seed:admin -- <email> [password]` | Promote or create an administrator |
| `npm run db:studio` | Open Prisma Studio |
