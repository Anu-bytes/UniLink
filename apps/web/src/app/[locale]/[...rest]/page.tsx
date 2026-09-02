import { notFound } from "next/navigation";

/**
 * Catch-all for any path under a locale that no other route matches. next-intl
 * needs this so unknown pages render the localized `not-found.tsx` (wrapped by
 * the [locale] layout — fonts, direction, and intl context) instead of falling
 * through to a bare, unlocalized 404.
 *
 * DO NOT add a `loading.tsx` at `[locale]` (or any segment above a route that
 * can call `notFound()`). A route-level loading file wraps the segment in a
 * Suspense boundary, and Next flushes the shell — status line included — as
 * soon as that fallback renders. `notFound()` thrown afterwards still renders
 * this page, but the response has already been committed as 200, which turns
 * every dead URL into a soft 404 that search engines index and monitoring
 * never sees. Put the fallback on a subtree with no `notFound()` beneath it
 * (see `(auth)/loading.tsx`) or use `<Suspense>` inside the page, below the
 * point where the not-found decision is made.
 */
export default function CatchAllNotFound() {
  notFound();
}
