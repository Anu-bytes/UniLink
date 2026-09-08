# Handover — admin dashboard

Branch `claude/admin-dashboard-endpoints-hivvmi`, PR #49 (draft).
Head `4d1f931`. 37 commits, 176 files, +23,525 / −31 against `main`.

## What this branch adds

`/{locale}/admin` — a bilingual, RTL-aware back office. Nine sections, 22 pages,
30 API route files, 69 components, 684 translation keys per locale.

**No migration.** `schema.prisma` already had `UserRole.ADMIN`, `publishedAt`,
`sortOrder` and a `UniversityContentBlock` whose comment anticipated exactly
this. Nothing about the database changes, so the branch can be merged and rolled
back without a schema step.

Two fixes landed alongside the feature and are described below, because both
change behaviour outside `/admin` and both are easy to undo by accident.

## Read this before touching the admin code

### Authorization must stay in the pages

`requireAdminPage()` is the first statement of all 22 admin pages. **Do not move
it back into the layout.** Next.js re-executes a layout only when the incoming
router state does not already match that segment, so on a client-side navigation
between two admin pages the layout is skipped and only the page renders. The
router state arrives in a request header, so it can also be forged directly.

An earlier revision of this branch guarded in the layout alone. It was reachable
with an ordinary STUDENT session cookie:

| Route | Student, before `3c69af0` | after |
|---|---|---|
| `/en/admin/users` | 10 email addresses, 2 phone numbers | 0 |
| `/en/admin/applications` | 6 email addresses | 0 |
| `/en/admin/leads` | 3 phone numbers | 0 |
| `/en/admin/users/{id}` | that account's email and phone | 0 |

A hard request always 404'd correctly; only the soft-navigation path leaked. The
layout still checks, so the shell is never built for the wrong person, but it is
not the gate. See the note at the top of `src/lib/admin.ts`.

### Do not add a `loading.tsx` above a route that can 404

A route-level `loading.tsx` wraps the segment in a Suspense boundary, and Next
flushes the response shell — status line included — as soon as that fallback
renders. A `notFound()` thrown afterwards still renders the right page, but the
status has already been committed as **200**. That turns every dead URL into a
soft 404 that search engines index and monitoring never sees.

`[locale]/loading.tsx` was doing exactly this and has been removed. Isolated to
that one file, nothing else touched:

| | `/en/this-page-does-not-exist` | `/en/universities/no-such-university` | `/ar/nonsense` |
|---|---|---|---|
| before | 200 | 200 | 200 |
| after | **404** | **404** | **404** |

The middle URL is an ordinary `[slug]` page, not the catch-all — which is how we
know the `[...rest]` catch-all was not the cause. It stays, because it is what
renders the *localized* not-found page inside the `[locale]` layout.
`[...rest]/page.tsx` carries a comment explaining the coupling.

The fallback is preserved for `(auth)`, a subtree with no `notFound()` beneath
it. If you want one elsewhere, put it on a subtree that cannot 404, or use
`<Suspense>` inside the page below the point where the not-found decision is
made.

## Running it locally

The repository already ships `compose.yaml` and the README documents the flow.
Use that; there is no need for a second compose file.

```bash
cp .env.example .env                    # optional, compose.yaml defaults work
cp apps/web/.env.example apps/web/.env  # then fill in the three required values
docker compose up -d db
npm run db:migrate
npm run db:seed
npm run db:seed:admin -- you@example.com 'a-long-password-here'
npm run dev
```

With the compose defaults, `apps/web/.env` needs:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unilink?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/unilink?schema=public"
AUTH_SECRET="<npx auth secret, or openssl rand -base64 32>"
```

Only those three are required. Everything else in `apps/web/.env.example` is
optional and degrades gracefully: without Supabase, image fields fall back to
pasting a URL; without Resend, the password-reset code prints to the server
console; without Google credentials, the Google button disappears and email +
password still works. Verified — the app builds, runs and signs in with only
those three set.

### Four things that waste time

1. **`/admin` 404s for everyone until `db:seed:admin` has run against the
   database the site is actually using.** That is the gate working. Running the
   script locally does nothing for a deployed environment.

2. **Five failed sign-ins per email per minute locks the account out, and the
   correct password is then rejected with the identical message.** `authorize()`
   returns the same `null` for "rate limited" as for "wrong password", so the UI
   cannot tell you to wait. Measured: 5 wrong attempts, then the right password
   rejected, then accepted ~70 seconds later. Pre-existing behaviour, not from
   this branch — but it reads exactly like a broken login.

3. **`npm run db:seed` rebuilds the children of the 13 universities it owns.**
   It deletes and recreates their programs, faculties, images, features, content
   blocks and minimum scores (`prisma/seed/index.ts`, lines 147-152). Idempotent,
   and it never touches universities it does not own — but any hand-editing of
   those 13 is lost. Safe against a throwaway local database; do not run it
   against production. `db:seed:admin` is safe anywhere.

4. **A local production build (`npm run build && npm start`) needs `AUTH_URL` or
   `AUTH_TRUST_HOST`**, which `apps/web/.env.example` does not mention. Without
   one, pages render fine but every sign-in dies with `UntrustedHost`. It does
   not affect `next dev` or Vercel, so use `npm run dev` locally and the problem
   never appears.

## How it was verified

Not just typechecked. Postgres 16, all 18 migrations, the catalogue seeded, then
driven over HTTP with real signed-in sessions.

- **API:** 401 / 403 / 200 for anonymous / student / admin. Bilingual search.
  400 with the offending `field` for a missing value, a `javascript:` URL and an
  out-of-range latitude. 409 on a duplicate slug, on a cascading delete without
  `?confirm=true`, and on demoting or deleting yourself. `publishedAt` preserved
  across a re-publish. No `passwordHash` in any response. 400 for a program or
  minimum score pointing at another university's faculty.
- **Authorization:** the table above, replayed over the RSC soft-navigation path
  with a real student cookie.
- **Pages:** 58 routes × 2 locales in a real browser, against data seeded to
  force every branch (all four role badges, published and draft rows, all six
  application statuses, an expired scholarship, a platform-wide scholarship, a
  university with nothing under it, an account with no profile). All 200, no
  leaked translation keys, no `MISSING_MESSAGE`/`FORMATTING_ERROR`, no client
  errors, no horizontal overflow, no `passwordHash` in any HTML.
- **From a clean clone:** `npm ci` → `migrate deploy` on an empty database →
  seed → build → start → signed in through the real login form → every section
  rendered in both locales.

`tsc --noEmit` clean, `npm run build` succeeds, both Vercel previews green.

## Open decisions

None of these are blocking; all were deliberately left for a human.

1. **Marketing loading fallback.** Removing `[locale]/loading.tsx` means the
   marketing pages, including the home page, have no route-level loading state.
   There is no way to keep one at `[locale]` and get real 404s — they are the
   same mechanism. Options: accept it; add `loading.tsx` to the individual
   marketing directories that cannot 404 (about, careers, contact, partners,
   privacy, programs, students, terms — the home page still cannot have one); or
   move fallbacks inside the slow pages as `<Suspense>`.
2. **Not-found inside `/admin` and `/app` still answers 200**, because those
   groups keep their own `loading.tsx`. Both are auth-gated and noindex, so
   search engines never see them. Deleting those files would make them 404 at the
   cost of the skeletons.
3. **`AUTH_URL` / `AUTH_TRUST_HOST` in `apps/web/.env.example`** — one line, not
   added because it is pre-existing and outside this branch's scope.
4. **The credentials rate limiter returning the same `null`** for a lockout as
   for a wrong password. Pre-existing; a small fix if the confusing login is
   worth removing.

## Known limitations

- Reordering testimonials renumbers only the rows on the current page.
- `leads` is read-and-delete: `PartnershipLead` has no status column, and adding
  one needs a migration this branch deliberately avoids.
- Long university and programme names truncate rather than wrap, to keep the row
  actions reachable without a horizontal scroll.
- `universities/[id]` and `universities/new` have no `loading.tsx`; the other
  sections do.

## Not done

A four-dimension audit of the finished branch (endpoint correctness, UI wiring,
i18n, completeness against the schema) was started and never completed — the
environment restarted three times mid-run. Only the access-control dimension
finished; it is what found the authorization gap above, which suggests the other
four are worth running before merge.
