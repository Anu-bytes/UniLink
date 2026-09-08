# Admin dashboard review — 7 September 2026

Reviewed branch `claude/admin-dashboard-endpoints-hivvmi`, commit `78014d1`.

This is a local audit and implementation follow-up, not a release sign-off. The findings below describe the original checkout; the follow-up records the changes now implemented. Existing untracked Compose files were left alone.

## Production database repair — 7 September 2026

The first authenticated production dashboard request failed with Prisma P2021:
`public.PartnershipLead` was missing. Public-page and anonymous-access checks at
deployment time did not cover this authenticated database path.

With explicit approval, the production database was repaired without resetting
or deleting data. The missing historical migration `20260820105140` was recovered
byte-for-byte: its SHA-256 matches the production migration record
`5ba623f8a6fb6fdf47459f6bb2cf7b348bf4209775027718f3a520c7d8527f36`.
It removed nine custom search indexes; it was not re-executed in production.

The three pending migrations restore those indexes, add the PARENT enum value,
and create PartnershipLead. They were applied together with the new
`20260907100738_secure_partnership_leads` migration in one transaction, with
lock/statement timeouts. The new table had RLS enabled and public client-role
privileges revoked before commit. Existing Next.js server access is retained.
Prisma `migrate resolve --applied` then recorded each executed migration.

Verified production results:

- `prisma migrate status`: all 17 migrations applied, history synchronized.
- Datamodel comparison: no missing application tables, columns, or enum values.
  The only differences are the nine intentional raw-SQL trigram indexes that
  Prisma cannot model. Do not execute the generated DROP INDEX diff.
- Counts unchanged before/after: 8 universities, 65 faculties, 330 programs,
  5 users, 0 applications. New leads table: 0 rows.
- PartnershipLead RLS enabled; anon/authenticated SELECT and INSERT denied.
- Live signed-in browser: all nine English admin sections loaded; university
  and program editors loaded; Arabic overview rendered with RTL direction.
  No production content records were edited during browser checks.

Local follow-up: localhost:5432 was unavailable when aligning local history;
no local database changes were made. Before the next local `migrate deploy`,
inspect its history and indexes. If the later restore-index migration is already
applied and all nine indexes exist, baseline the recovered historical migration
with `prisma migrate resolve --applied 20260820105140` rather than executing its
old DROP INDEX statements. Then deploy the new leads-security migration.

This was a database-only repair; the existing Vercel deployment remains live.
Migration files and this report are local changes, not yet pushed to GitHub.

## Rich catalogue rows follow-up

Universities and Faculties now expose more operational detail while keeping
the five-column layout. University rows include promotion flags, clickable
published/draft program counts, faculty counts, and last-updated dates. Faculty
rows include two linked program previews and score-coverage indicators.

Both tables have keyboard-operable, independently expandable detail rows.
These show an explicit content checklist, editor links, and record metadata;
faculty slugs and display order are no longer in the collapsed rows. University
promotion flags are also explained in the expanded panel. The content checks
only test presence of the listed fields, not overall publication readiness or
whether an external image URL currently works.

Faculty-specific score rules and university-wide rules are counted separately;
the UI does not collapse certificate systems, years, or units into one misleading
cut-off. Preview queries return at most two program names per faculty, and
published-program counts are batched for the current university page. No schema
or API contract changed, and no seeded catalogue record was edited.

Verification: production build, TypeScript, admin lint, 12 unit tests (including
three new content/score-coverage tests), and 718 integration assertions passed.
English and Arabic desktop/mobile checks covered both expanded tables; 390px
page width was preserved without overflowing cells. Keyboard Space collapses
details, score-review links reach the correct university scores tab, and the
published-program link was verified against the matching 13-program list.
The integration probe cleaned up its disposable fixtures; viewport overrides
were reset.

## Table readability follow-up

Extended the Programs table treatment to Universities, Faculties, Applications,
Users, Leads, Scholarships, and Testimonials, without changing API or database
contracts.

- University type is quiet name metadata; location is stacked. Faculty slug and
  order sit beneath the bilingual name instead of taking separate columns.
- Applications have one status control, grouped submission/update dates, and
  readable applicant/program details. Users group name, email, and phone while
  keeping role, counts, and join date visible. Leads group contact channels;
  they still have no follow-up status field in the existing data model.
- Scholarships group their university beneath the bilingual title. Testimonials
  show a three-line quote preview and group student/location information while
  retaining ordering controls.
- Destructive row actions use a shared menu with the existing confirmation
  flows. User self/last-admin locks remain enforced and explained. Dialog
  cancellation restores focus to the row trigger, including university actions.
- Populated desktop views were visually checked in English and Arabic. All 14
  localized table views were checked at 390px: page width remained 390px, with
  horizontal scrolling contained in the tables and no overflowing table cells.
  Temporary viewport overrides were reset.
- Production build, TypeScript, admin lint, and nine unit-test groups passed.
  The integration matrix passed 718 assertions. Disposable fixtures, including
  a funded/expired scholarship and long testimonial for visual QA, were removed;
  the original 13 universities, 87 programs, one admin, zero applications and
  zero leads were verified.
- The smoke probe now refuses `--hold` without an interactive terminal before
  creating any records. A non-interactive held run had left its fixtures behind
  after completing assertions; those exact fixtures were explicitly cleaned up.

## Latest release-readiness follow-up

Completed the available local admin hardening and verification. Live remote
storage verification is blocked by missing credentials; this is not a blanket
production or cross-browser sign-off.

### Additional fixes

- Fixed repeat student submissions overwriting the application's original
  `submittedAt`; the conditional timestamp write and status update now run in
  one transaction.
- Fixed mobile drawer focus entry, Tab wrapping, Escape focus restoration,
  background interaction, and cleanup when resizing to desktop.
- Fixed mobile overflow caused by long applicant names/emails and university
  options, on application review, user detail, and application filters.
- Replaced the two admin hydration-effect lint errors with hydration-safe
  external-store subscriptions, preserving the existing sidebar preference key.
- Hardened storage deletion to accept only canonical URLs from the configured
  project's own bucket, not a lookalike URL on another origin. Supabase SDK
  deletion errors are checked; explicit media DELETE reports failures instead
  of returning a false success. Automatic cleanup remains best effort.
- Corrected this machine's gitignored app database URLs to the existing Compose
  database at localhost:5432. Added `db:up`, `db:deploy`, and repeatable admin test
  scripts. The normal production build now uses the verified Webpack path;
  `build:turbo` remains available explicitly. No migration, credential rotation,
  remote project configuration, or seeded catalogue edit was performed.

### Verification results

- **718/718 local integration assertions passed** in the new repository
  probe `apps/web/scripts/admin-smoke.mjs` (the file is in the working tree;
  no git commit has been made). It uses disposable local accounts/data and
  refuses remote app/database targets.
- Coverage: all discovered admin API methods reject anonymous/student callers;
  every admin page has English/Arabic HTML and matching-layout RSC checks for
  admin/student/anonymous sessions; includes explicit overview refetches,
  immediate role revocation with an existing session, self-lockout guards,
  account deletion/cascade confirmation, student ownership, all admin application
  states, timestamp preservation, academic-profile data, internal-note privacy,
  disjoint concurrent edits, and genuine public 404 responses.
- **9/9 unit test groups passed**, covering scores, pagination, safe error
  messages, image signatures/size, storage URL targeting, and ordering failures.
- `npm run build`, `npm run lint:admin`, script lint, TypeScript, and
  `git diff --check` passed. The build is now the normal root command, not a
  one-off flag override.
- `npm run db:deploy` finds all 15 migrations applied. Plain `npm run dev`
  restarted successfully on localhost:3000 with no database overrides.
- Browser verified: university actions menu, Arabic field/toast errors,
  cancel/discard tab navigation, language-change protection with query/tab
  preservation, Back cancellation, confirmation focus trapping/restoration,
  mobile drawer focus/Escape, an attention link's status filter, populated
  profile/review rendering, and saving an offer/notes on a disposable test
  application. No real applicant decision was changed.
- Responsive checks at 390×844 covered overview, universities, programs,
  applications, users, leads, scholarships, testimonials, populated user/lead
  details in both languages, plus populated application review. After fixing the
  three overflowing surfaces, their English/Arabic page width matched the 390px
  viewport. The temporary viewport override was reset.
- Temporary fixtures were cleaned up. Verified the original 13 universities,
  87 programs, one admin, zero applications, and zero leads, with no smoke-test
  users or universities left over. Original untracked Compose files were left
  untouched.

### Remaining boundaries

1. **Remote storage:** this machine has neither `SUPABASE_URL` nor
   `SUPABASE_SERVICE_ROLE_KEY`. Both upload and explicit deletion correctly
   return 503. Real upload/read/delete and bucket policy verification need the
   intended project's credentials; no unrelated Supabase account was chosen or
   configured. See the server-only storage setup in `apps/web/.env.example`.
2. **Existing broader-project lint debt:** the full app lint run found 16 errors
   before the two admin fixes, leaving 14 pre-existing errors outside the admin
   scope (public/student/onboarding components). Admin lint is clean. Do not
   interpret the targeted result as a clean whole-project lint result.
3. **Concurrency/product limitations:** reordering remains multiple requests
   with stop-on-error and server refresh, not transactional rollback; same-field
   edits remain last-write-wins. Cross-page testimonial ordering remains limited.
   Tests verify these existing behaviors, not optimistic locking or atomicity.
4. **Environment/device coverage:** the tested in-app browser supports guarded
   Back navigation. Older browsers without the Navigation API and a full
   Safari/Firefox/device matrix have not been signed off. The Turbopack build's
   environment issue was accommodated by using Webpack, not fixed in Next itself.

The sections below preserve the earlier audit history and are superseded by the
results above where they overlap.

## Initial implementation follow-up

- Added an overview “Needs attention” section linking to submitted applications, reviews in progress, and unpublished university drafts. Pipeline tiles now link to their status filters.
- Gave university/program names two lines, prioritized the current language, removed low-value slug text from those rows, and grouped university publication/deletion actions in a menu.
- Added independent dirty-editor registration, a translated discard/keep-editing dialog for link and language navigation, guarded sign-out, and browser close/reload protection. Modern browsers with the Navigation API also guard Back/Forward; older-browser history traversal remains a compatibility check.
- Added keyboard focus trapping/restoration and an associated description to the shared confirmation dialog.
- Added server-side percentage and English-test bounds to POST and PATCH, including validation against existing values when only the unit or test changes. UI bounds/hints follow the same rules. TOEFL retains the catalogue's existing 0–120 scale; GPA scale policy is still a product decision.
- Added stable API error codes and safe English/Arabic client messages across the six request wrappers. Bilingual inputs now include their field name in their accessible name; field hints/errors are associated with controls.
- Bounded pagination in both API and page parsers. Arabic record headings use Arabic names where available, URL hints are isolated LTR, and locale changes preserve the active editor tab/query.
- Included the existing academic-profile card in application review.

Verification on the revised source:

- Local HTTP probe: **159/159 assertions passed**, including the original three failing cases, invalid-score creation, and unit-only/test-only partial updates. All temporary records were removed; seeded catalogue data was preserved.
- Added `apps/web/src/lib/admin-validation.test.ts`: **4 test groups passed** using `node --import tsx --test src/lib/admin-validation.test.ts` from `apps/web`.
- `npx tsc --noEmit` and `git diff --check` passed.
- Production build passed with `npm run build --workspace=apps/web -- --webpack`. The default Turbopack build was blocked by an environment worker-port permission error after an initial restricted-network font failure; it is not recorded as passing.
- Targeted ESLint reports only two pre-existing `react-hooks/set-state-in-effect` errors: sidebar localStorage hydration in `admin-shell.tsx`, and portal mount detection in `confirm-dialog.tsx`. No new lint errors remain in the checked admin components/helpers.
- Visually checked the revised overview and Arabic university editor; verified Arabic heading, LTR URL, and accessible field labels. The original browser tab remains blocked by a native confirmation created during the earlier guard test. Pointer/keyboard clicks in the separate preview also fail on clean forms, so final discard-dialog, menu, and responsive interaction checks remain pending. Temporary unsaved edits in the separate preview were restored without saving.

The release checks at the end of this report still apply, except that the Webpack production build has now passed. This is not yet a complete browser/device or permission-regression sign-off.

## Migration discrepancy resolved

`prisma migrate status` reports all 15 migrations in this checkout applied. A comparison of the running local database against `schema.prisma` proposes only nine `DROP INDEX` statements, all for the manually created `pg_trgm` search indexes. It proposes no table or column changes.

The reason is already documented in `apps/web/prisma/migrations/20260825090000_restore_search_trgm_indexes/migration.sql`: `migrate dev` wants to remove these raw-SQL indexes because they are absent from the Prisma model.

For applying existing migrations during setup, use `npm run db:deploy` with the intended database configuration. Preserve the indexes; do not accept an autogenerated migration that drops them. The original dev session needed a port-5432 override because the app environment pointed to port 5433; the latest follow-up corrected the local environment and verified plain `npm run dev`.

## Original audit findings (before the follow-up)

### P2 — Editor tab navigation silently loses unsaved work

Reproduced in the university editor: change the English name, select Media, then return to Details. The original name is restored without any confirmation. The test edit was never saved.

`universities/details-form.tsx` holds the draft in component state; `universities/editor-tabs.tsx` uses ordinary links. The visible dirty-state text provides no navigation guard. Preserve drafts across tabs or prompt before discarding them; cover sidebar navigation, language changes, and browser departure as well.

### P2 — Minimum score validation permits impossible percentages

Created a temporary percentage cut-off and PATCHed `minScore: 150`. The endpoint returned 200 and stored it. The schema caps the numeric database representation at 9999.99 but does not validate against the selected unit.

Sources: `apps/web/src/app/api/admin/universities/[id]/minimum-scores/route.ts` and `[scoreId]/route.ts`. Validate the effective unit and score together on POST and PATCH, including when only one is supplied. A PERCENT score must not exceed 100; GPA scales require an explicit product rule.

### P2 — English test requirements lack test-specific score validation

Created an IELTS requirement and PATCHed its score to 150; the endpoint returned 200. The endpoints apply a generic cap of 200 to all tests.

Sources: `apps/web/src/app/api/admin/programs/[id]/english-requirements/route.ts` and `[requirementId]/route.ts`. Validate the effective test/score pair on both creation and partial updates. Align the form's bounds and hints with the supported scales.

### P2 — Arabic forms show English server errors

On the Arabic university editor, submit `---` as the slug. The save is correctly rejected, but both the field error and toast description say `Slug cannot be empty` in English.

`universities/request.ts` forwards the raw API error and `universities/details-form.tsx:164` displays it directly. Similar wrappers occur in other sections. Introduce stable error codes and translate them in the UI, including field errors and duplicate/conflict responses. Matching translation keys alone does not cover error paths.

### P2 — Bilingual inputs have ambiguous accessible names

The accessibility tree labels Name, Country, City, and Address inputs only as “ENGLISH” or “ARABIC.” The actual field name is rendered as an unassociated paragraph in `apps/web/src/components/admin/form.tsx:223`.

Associate each input with both its field name and language, for example “University name, English,” and connect field hints/errors through `aria-describedby`. The visual grouping currently supplies context that is missing to assistive technology.

### P3 — Excessive pagination produces HTTP 500

`GET /api/admin/universities?page=999999999999999999999` returned 500. `apps/web/src/lib/admin-api.ts:98` clamps the lower bound only, then multiplies the result for Prisma's `skip`. Bound page/offset to an accepted integer range or reject invalid values with 400. Check page-side parsers as well as this shared helper.

## Coverage against the schema and UI

| Area | Coverage and gaps observed |
| --- | --- |
| Universities | Identity, location, contact, descriptions, visibility, images, features, content blocks, and minimum scores have management controls. `viewCount` is system data rather than an editor field. |
| Faculties | Identity, parent university, descriptions, image, and ordering are exposed; related programs are linked. |
| Programs | Identity, study level/field, descriptions, duration, minimum grade, tags, co-op, fees, intakes, and English requirements are represented across tabs. |
| Users | Account and academic profile can be read; role changes and deletion are exposed. API name/phone updates have no corresponding account edit controls. Decide whether support staff need them. |
| Applications | Status and notes are editable. The application API returns the academic profile, while the review page selects basic applicant details and links to the user. Displaying key eligibility information in the review screen would avoid an extra navigation. Application DELETE exists in the API but has no corresponding review action; decide whether that omission is intentional. |
| Leads | Read/delete matches current schema capabilities; there is no lead-status column. |
| Scholarships | Parent association, bilingual content, amount/currency, deadline, and publication are represented. |
| Testimonials | Content, portrait, ordering, and publication are represented. Cross-page ordering remains a known limitation. |

Other schema fields such as credentials, tokens, timestamps, and saved-item relations should not automatically become writable admin controls. Product completeness should be judged by the intended staff workflows.

## Design assessment

Keep the overall direction. The navy sidebar, blue active state, restrained surfaces, grouped navigation, paired bilingual fields, status badges, editor tabs, and sticky Save bar form a coherent starting point.

Recommended changes, in order:

1. Protect unsaved work and improve error/accessibility behavior before visual polish.
2. Give the overview a clear “needs attention” area with links to submitted applications and other actionable queues. The current totals and six equally weighted pipeline cards provide little prioritization.
3. Give university/program names more room. The university table truncates long names while devoting a third line to a slug and a column to three row actions. De-emphasize slugs, allow two-line names, and group infrequent actions in a menu.
4. Make application review more self-contained: key academic profile details beside the status/notes form, with a clear next application action if that matches the staff workflow.
5. Finish Arabic-specific details. The inspected Arabic university editor still uses the English name for its main title despite an Arabic name being available. The URL hint inherits RTL and displays the slash order awkwardly; isolate URLs as LTR. Evaluate whether Arabic should lead for record headings throughout the console.
6. Improve empty-state usefulness where an action exists. Catalogue empty states can point to creation; applications should explain how records arrive. Do not add decorative charts merely to occupy space.

Screens visually inspected: overview, empty applications, populated university list, university details/media, and the Arabic university editor. The browser viewport changed from desktop width to a narrower window during inspection; no deliberate mobile/device matrix was completed.

## Original verification and remaining release checks

The local HTTP script ran 153 assertions: 150 passed, three failed (the two invalid-score cases and excessive pagination above). It is an audit probe rather than a committed regression suite.

- All nine list/stats endpoints: anonymous 401, administrator 200; sampled responses did not contain `passwordHash`.
- University/faculty/program/testimonial/scholarship creation and detail reads; university publish/re-publish timestamp preservation; cascade confirmation; invalid latitude and unsafe website rejection; Arabic search.
- Create/list/update/delete for images, features, content blocks, minimum scores, intakes, and English requirements.
- 38 page requests: overview, eight lists, five creation pages, and five populated detail pages, each in English and Arabic; all returned 200 without `MISSING_MESSAGE` or `FORMATTING_ERROR` markers. These are HTTP checks, not 38 independent browser interaction tests.
- English and Arabic `Admin` translation key sets match.
- `npx tsc --noEmit` passed.
- Temporary audit university and its children, testimonial, and scholarship were deleted successfully. Seeded catalogue records were preserved. The rejected Arabic slug edit was cleared by reloading the editor.

Still required for release sign-off: full student-versus-admin RSC regression, populated application/lead/user detail workflows and status/role transitions, concurrent edits and ordering failures, configured media upload/delete integration, responsive/keyboard navigation across all sections, and a fresh production build after fixes. The handover's earlier checks are useful history, not a substitute for those checks on the final revised branch.
