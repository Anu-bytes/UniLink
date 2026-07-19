import { notFound } from "next/navigation";

/**
 * Catch-all for any path under a locale that no other route matches. next-intl
 * needs this so unknown pages render the localized `not-found.tsx` (wrapped by
 * the [locale] layout — fonts, direction, and intl context) instead of falling
 * through to a bare, unlocalized 404.
 */
export default function CatchAllNotFound() {
  notFound();
}
