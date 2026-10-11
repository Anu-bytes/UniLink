"use client";

import { useSavedCount } from "@/components/app/saved-context";

/**
 * The live saved total (faculties + universities) as plain text, for server
 * pages like the dashboard: it follows hearts toggled anywhere in the app
 * instead of freezing at the number the page was rendered with.
 */
export function SavedCount() {
  const { count } = useSavedCount();
  return <>{count}</>;
}
