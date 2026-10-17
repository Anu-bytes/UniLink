"use client";

import { usePathname } from "@/i18n/navigation";

/**
 * Page-to-page entrance: the new page fades and rises in (.ul-page-enter in
 * globals.css). Keyed on the pathname, so only a real page change animates;
 * query-only updates (profile tabs, directory filters) swap in place.
 *
 * Plain CSS on purpose. This used React <ViewTransition> (the View
 * Transitions API, with the card photo flying into the profile banner), but
 * a view transition freezes the old page and waits for the new one's images
 * before it starts: a university profile took about 2 seconds to appear
 * after its data had already arrived, against about 0.2 without it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="ul-page-enter flex flex-1 flex-col">
      {children}
    </div>
  );
}
