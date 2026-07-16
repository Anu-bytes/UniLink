# UniLink — Web

The Next.js frontend and API for UniLink.

See the [root README](../../README.md) for full setup, environment configuration, and workspace scripts.

## Local development

From the **repository root** (recommended, so workspace scripts resolve):

```bash
npm install
npm run dev
```

Or from inside this directory:

```bash
npm run dev        # start dev server on http://localhost:3000
npm run build      # prisma generate + next build
npm run lint       # eslint
npm run db:migrate # prisma migrate dev
npm run db:studio  # prisma studio
```

## Structure

- `src/app/[locale]/` — localized routes (marketing pages, auth flows)
- `src/app/api/` — API route handlers (auth, registration)
- `src/components/` — UI components (incl. `ui/` shadcn primitives, `onboarding/` wizard)
- `src/lib/` — Prisma client, schemas, shared helpers
- `src/i18n/` — next-intl routing & request config
- `messages/` — translation catalogs (`en.json`, `ar.json`)
- `prisma/` — database schema & migrations
