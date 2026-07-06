# UniLink — Full Project Plan & Recommended Tech Stack

**An ApplyBoard-style university & program discovery / application platform for Egypt (bilingual EN/AR).**

> Status: Planning draft v1.0 — 6 July 2026
> Sources: *UniLink – Features (Updated 5-4-2026)*, *UniLink SRS – Phase 1 (v1.0)*, *UniLink Website UI Kit*.
> This document plans the **whole product**. Phase 1 is fully specified in the SRS; later phases are planned from the Features brief and will be detailed in their own SRS before build.

---

## 1. Product summary

UniLink helps prospective students in Egypt discover, compare, and apply to universities and programs, and gives universities a data-driven portal (analytics, CRM, applications, marketing). It is a **multi-sided platform**: students, university admins, and a super admin, with subscriptions, application commissions, ads, and financing as revenue.

Defining constraints that drive every technical choice:

- **Bilingual EN/AR with full RTL** — instant toggle, no reload, persisted; data stored per-language (`_en`/`_ar`).
- **SEO + performance** — server-rendered landing & profiles; LCP < 2.5s on mid-tier mobile/4G; search < 1s p95; autocomplete < 300ms.
- **Geospatial core** — "find near me", radius & viewport queries, custom interactive map.
- **Egypt-first** — local payment rails, Arabic content quality, data-residency/latency, Egyptian data-protection law (PDPL 151/2020).
- **Forward compatibility** — the Phase 1 data model, search, and map are reused by every later feature.

---

## 2. Recommended tech stack (with rationale)

Guiding principle: **one language end-to-end (TypeScript)**, a clean web ⇄ API split (as the SRS mandates), managed infra in a MENA region, and Egypt-appropriate third parties. Start lean; add specialized infrastructure (search engine, analytics warehouse, queue) only as the phase that needs it arrives.

| Layer | Recommendation | Why (tied to requirements) |
|---|---|---|
| **Repo** | **Monorepo** — Turborepo + pnpm workspaces (`apps/web`, `apps/api`, `packages/*`) | Shared TS types across web/API, atomic changes, one CI. Matches the required web/API separation without two repos. |
| **Web app** | **Next.js (App Router) + React + TypeScript** | SSR/SSG/ISR satisfies SEO (`NFR-SEO-01`) and LCP (`NFR-PF-03`); React Server Components shrink the read-path API surface; best-in-class i18n & huge hiring pool in Egypt. |
| **i18n / RTL** | **next-intl** + CSS logical properties; `dir="rtl"` per locale; fonts per script | Instant EN↔AR toggle without reload, persisted (`NFR-LC-01/02`); logical properties make one stylesheet work LTR & RTL. |
| **Styling / UI** | **Tailwind CSS + shadcn/ui (Radix primitives)** | Accessible (WCAG 2.1 AA, `NFR-AC-01`) components; design tokens map cleanly to the existing UI kit (`#0047FF` primary, `#F82C1F` accent, Inter/Plus Jakarta Sans + IBM Plex Sans Arabic/Cairo). |
| **Backend API** | **NestJS (Node + TypeScript)** — REST, versioned (`/api/v1`) | Modular DI architecture scales to a multi-role SaaS (auth, payments, CRM, analytics, applications). Shares types with web. Phase-1 read endpoints can also live in Next route handlers, but stand up NestJS early to avoid a rewrite. |
| **Validation** | **Zod** (shared web+API) | Runtime input validation & enum rejection (`API-03`, `NFR-SE-03`); one schema drives types + validation. |
| **Database** | **PostgreSQL + PostGIS** | The SRS reference DB; first-class geospatial (`ST_DWithin`, KNN, bounding box) for find-near-me & map (`FR-GS-01/02`). Relational integrity for the University→Faculty→Department→Program hierarchy. |
| **ORM** | **Prisma** (spatial queries via `$queryRaw` + PostGIS) | Great DX, migrations, type-safe. `geo_point` as `Unsupported("geography(Point,4326)")` kept in sync by a DB trigger (`DM-05`); the few spatial queries use raw SQL. *Alternative: Drizzle ORM* if the team prefers SQL-first geo. |
| **Search & autocomplete** | **Meilisearch** (Postgres = source of truth) | Typo-tolerant, bilingual, sub-50ms autocomplete; built-in ranking, synonyms, and Arabic normalization (`FR-SR-02/03/04`, relevance `FR-SR-06`). *Lean MVP fallback:* Postgres `pg_trgm` + `unaccent` + a custom Arabic-normalization column, swap to Meilisearch when search quality demands. |
| **Cache / rate-limit / jobs** | **Redis** (+ **BullMQ** for jobs) | Caches hot search/autocomplete (`API-04`, `NFR-PF-04`); rate-limits public geo/search endpoints (`NFR-SE-03`); later runs background jobs (emails, notifications, doc verification, analytics rollups). |
| **Maps** | **MapLibre GL JS + MapTiler vector tiles** | The SRS-recommended provider: full custom styling & branded markers, clustering, popups, viewport queries; open-source renderer, no per-load fee, good Egypt coverage. Key restricted by referrer (`NFR-SE-04`). |
| **Auth (Phase 2+)** | **NestJS + Passport (JWT access+refresh) + Argon2 + RBAC** | Full control over the custom 3-role, multi-tenant model. *Move-fast alternative:* Supabase Auth or Clerk. |
| **Payments (Egypt)** | **Paymob** (cards, mobile wallets, installments via valU/Sympl/Aman) + **Fawry** (cards + cash/reference codes, ubiquitous in Egypt) | Local rails matter — Stripe is not generally available to Egyptian merchants. Covers application fees, UniLink service fee, subscriptions, revenue share, and financing. *Also consider:* Kashier / PayTabs. |
| **Notifications** | Web Push (VAPID) + **FCM** (web now, mobile later); email via **Amazon SES** or Resend; **WhatsApp Business Cloud API** for CRM; SMS via local provider/Twilio | Deadlines, updates, offers, reminders; WhatsApp is a primary channel in the Egyptian market for lead comms. |
| **Object storage / media** | **S3-compatible** (AWS S3 or Cloudflare R2) + CDN; Next/Image | University images/videos, student documents; CDN for image performance; R2 avoids egress fees. |
| **AI features** | **Anthropic Claude API** (latest — Opus 4.8 / Sonnet 5) + **pgvector** | Chatbot/advisor, Arabic-capable document verification (vision OCR of IDs/certificates), content generation, aptitude narrative, Knowledge-Hub personalization (embeddings in pgvector). Recommendations start rule-based (SRS logic) then ML. |
| **Product/behavior analytics** | **PostHog** (self-hostable) → nightly rollups to Postgres; **ClickHouse** at scale | Powers the "Google-Analytics-for-universities" dashboards (traffic sources, time-on-page, drop-off, program performance). ClickHouse when event volume outgrows Postgres. |
| **CRM** | Built in-app (NestJS module + Postgres) | Lead scoring (hot/warm/cold), notes, status, email/WhatsApp — tightly coupled to platform data, not a third-party CRM. |
| **Reports/export** | Server-side PDF (Playwright/Puppeteer) + **exceljs**, run in BullMQ | Downloadable PDF/Excel & monthly reports for universities. |
| **Real-time** | NestJS WebSocket gateway (Socket.IO) / SSE | Live RSVP tracking, notifications, chatbot streaming, ambassador chat. |
| **Virtual tours / 3D** | Third-party embed (Matterport / Kuula / 360) | "Digital twin" / virtual campus tours — integrate, don't build. |
| **Hosting / infra** | **AWS** in a MENA region (**me-central-1** UAE or **me-south-1** Bahrain): ECS Fargate/EKS, RDS Postgres+PostGIS, ElastiCache Redis, S3+CloudFront; Meilisearch on a container | Low latency to Egypt + data-residency posture; managed services reduce ops. Containers keep web+API portable. *Faster start:* Render/Railway for early phases. |
| **IaC / CI-CD** | **Terraform** + **GitHub Actions**; Docker | Reproducible environments (dev/stage/prod), automated test + deploy. |
| **Observability** | **Sentry** (errors) + OpenTelemetry → Grafana/Prometheus (or Datadog); **pino** logs; uptime monitor | Meets 99.5% availability target (`NFR-RL-01`) and perf SLOs. |
| **Testing / QA** | Vitest/Jest (unit), Playwright (e2e incl. RTL + **axe** a11y), Testing Library, **k6** (load), ESLint/Prettier, TS strict | Verifies acceptance criteria, WCAG AA, and the perf SLOs (<300ms / <1s / LCP<2.5s). |
| **Mobile (future)** | **React Native / Expo** (reuses TS + team); PWA in the interim | "Mobile app" is a future feature; PWA covers early mobile needs. |

### Architecture at a glance

```
                         ┌─────────────────────────────────────────┐
   Browser (EN/AR, RTL)  │  Next.js web  (SSR/ISR, next-intl,       │
   ───────────────────►  │  Tailwind + shadcn, MapLibre)           │
                         └───────────────┬─────────────────────────┘
                                         │ REST /api/v1 (JSON, lang, pagination)
                         ┌───────────────▼─────────────────────────┐
                         │  NestJS API  (RBAC, Zod, rate-limit)     │
                         │  modules: catalog · search · geo · auth  │
                         │  · applications · payments · crm · analytics │
                         └───┬───────┬───────┬───────┬───────┬──────┘
                             │       │       │       │       │
                       Postgres  Meili-   Redis   S3/CDN  Claude API
                       +PostGIS  search  (cache/  (media) (AI/OCR)
                       (source   (search) queue)
                       of truth)
                             │
                    Paymob/Fawry · SES/WhatsApp/FCM · PostHog/ClickHouse · MapTiler
```

---

## 3. Phased roadmap (whole product)

Durations assume a small focused team (see §5) and overlap where dependencies allow. Phase 1 = the SRS. Phases 2+ are planned from the Features brief and each gets its own SRS before build.

### Phase 0 — Foundations (~2–3 weeks)
Monorepo + CI/CD + IaC skeleton; design system from the UI kit (tokens, Tailwind theme, EN/AR fonts, RTL); PostGIS schema + migrations + **seed pipeline**; NestJS + Next scaffolding; i18n framework; observability baseline. *(Often folded into Phase 1.)*

### Phase 1 — Public Discovery *(the SRS)* (~6–10 weeks)
The public, unauthenticated discovery layer everything else builds on.
- SSR landing page: hero search, field-of-study chips, find-near-me, featured, "how it works", header/footer, EN/AR toggle.
- Unified **bilingual search**: matches `name_en`/`name_ar`, Arabic normalization, 300ms-debounced autocomplete, grouped results, relevance ranking.
- **Filters & sorting**: field, degree type (default Undergraduate), fee bucket / explicit range, location, national/intl; combinable AND / within-filter OR; sort by fees/name/distance; filter state in URL.
- Read-only **university & program profiles** (SEO slugs, embedded map, faculty→dept→program hierarchy, verification badge).
- **Find near me**: browser geolocation → nearby (default 25km, adjustable), distance labels, graceful denial/timeout fallback (manual city).
- **Interactive custom map**: branded markers, clustering, popups, "search this area" viewport query, user marker + radius, list↔map sync, mobile map/list toggle.
- **Reference read-only API** (`/api/search`, `/autocomplete`, `/universities`, `/universities/{slug}`, `/programs`, `/universities/nearby`, `/universities/within`, `/fields`, `/fee-buckets`) + seeded EN/AR data with coordinates.
- **Exit criteria:** all SRS acceptance criteria pass; perf SLOs met; WCAG 2.1 AA; EN/AR verified.

### Phase 2 — Accounts & Student Experience (~6–10 weeks)
Auth (student / university-admin / super-admin), student registration & onboarding (high-school type, up to 3 fields of interest, certification type, contact, graduation date, **budget range**, optional profile/docs), profile + health score, favorites/saved, recently viewed, student dashboard, Info & FAQ pages, **faculty-level comparison** ("apples to apples"), **rule-based recommendations** (interests × budget × field × location), in-app/email notifications. Super-admin basics (manage universities, programs, users, controlled vocabularies).

### Phase 3 — University Portal & Verification (~6–10 weeks)
University-admin onboarding & self-service content (faculties/departments/programs, images/videos), **verification badge + subscription tiers** (Free/Basic/Pro/Premium billing via Paymob/Fawry), university dashboard **overview KPIs** + core analytics (student insights, traffic/behavior via PostHog, program performance), registered-students view.

### Phase 4 — Applications & Payments (~8–12 weeks)
**Unified application system**: fill once, submit to many; application fee + UniLink service fee + **2% commission** revenue share; payment integration; status tracking (Submitted → Under Review → Accepted/Rejected/Missing Docs → Completed); **AI document verification** (Claude vision OCR for IDs/certificates); deadline/status notifications; financing/installment partners.

### Phase 5 — CRM, Advanced Analytics & AI (ongoing, ~8–12 weeks)
Built-in **Lead Management CRM** (hot/warm/cold, notes, status, email/WhatsApp), advanced analytics + marketing performance, **reports/export** (PDF/Excel, monthly), AI features (chatbot advisor, predictive demand analytics, email automation, program suggestions for universities); introduce **ClickHouse** as event volume grows.

### Phase 6 — Engagement & Growth
**Events & Open Days calendar** (uni self-service posting, targeted invites, RSVP/attendance, smart reminders, virtual-tour/digital-twin embeds), **Ambassador** ("talk to a current student"), **Knowledge Hub** (CMS, guest/sponsored content, AI personalized reading list via pgvector, contextual linking), **Career Discovery & Aptitude Assessment** (Holland Codes + skill-to-major mapping + AI guidance), **strategic ad placements / sponsored entries**, reviews & ratings, student community.

### Phase 7 — Mobile & Beyond
**React Native / Expo** mobile app, internship/job section, deeper AI advisor, and expansion beyond Egypt (multi-country, multi-currency, more locales).

---

## 4. Cross-cutting workstreams (run through every phase)

- **Data & content ops** — sourcing universities, accurate coordinates, and quality Arabic translations; seed + update cadence. *(SRS open question — biggest launch risk.)*
- **Design/UX** — extend the UI kit into full EN/AR component library; RTL parity on every screen.
- **Security & privacy** — HTTPS everywhere, input validation & rate limiting, transient handling of precise geolocation (never persisted), secrets management, referrer-locked map keys; **Egypt PDPL (Law 151/2020)** compliance for accounts/applications.
- **Accessibility** — WCAG 2.1 AA as a definition-of-done gate (keyboard, contrast, focus, SR labels, list alternative to the map).
- **Performance** — caching, viewport lazy-loading, image optimization, load-tested against the SLOs.
- **QA & release** — automated e2e (incl. RTL + a11y), staging environment, feature flags, phased rollout.

---

## 5. Team & timeline (indicative)

**Core team:** 1 Product/PM · 1 Product Designer · 2–4 Frontend · 2–4 Backend · 1 DevOps/SRE · 1 QA · part-time Data/Content ops · part-time AI/ML (from Phase 4).

**Rough timeline:** Phase 1 MVP in ~**2–3 months**; the full multi-sided platform is a ~**12–18 month** program across phases (2–6 overlap once foundations land). Estimates firm up per-phase after each phase's SRS.

---

## 6. Key decisions to confirm before build

Carried from the SRS open questions, plus stack-level choices:

1. **Map provider & budget** — MapLibre + MapTiler (recommended) vs Mapbox vs Google; tile cost at scale.
2. **University data source** — where coordinates and Arabic translations come from, and update cadence *(critical path)*.
3. **Payment gateway** — Paymob and/or Fawry (recommended); merchant-account timelines in Egypt.
4. **Hosting region / data residency** — AWS UAE (me-central-1) vs Bahrain (me-south-1) vs a local provider; PDPL posture.
5. **Search infra** — Meilisearch from Phase 1 vs Postgres `pg_trgm` MVP first.
6. **Auth** — self-hosted NestJS/JWT (recommended, full control) vs Supabase/Clerk (faster).
7. **Featured/Trending rule** — manual curated list vs ranked/algorithmic.
8. **Radii for find-near-me** — default and selectable values tuned for Egyptian cities.

---

## 7. Suggested immediate next steps (once the plan is approved)

1. Lock the §6 decisions (map, data source, payments, region).
2. Stand up Phase 0 foundations (monorepo, CI/CD, PostGIS schema + seed, design tokens, i18n).
3. Turn the SRS into a Phase 1 backlog (epics → stories mapped to `FR-*` IDs with acceptance criteria).
4. Begin Phase 1 build against the SRS acceptance criteria.

*No code has been scaffolded yet — this is the plan for review.*
