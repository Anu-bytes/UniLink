"use client";

import { ViewTransition } from "react";

import { usePathname } from "@/i18n/navigation";

/**
 * Animates page-to-page navigation with the View Transitions API: the old
 * page fades up and away, the new one rises in (see .ul-page-* in
 * globals.css). Keyed on the pathname, so only a real page change animates;
 * query-only updates (profile tabs, directory filters) swap in place without
 * the whole page flickering. Browsers without view transitions just
 * navigate normally.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="ul-page-in" exit="ul-page-out" default="none">
      {children}
    </ViewTransition>
  );
}
