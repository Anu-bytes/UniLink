"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live `window.matchMedia(query).matches`, re-rendering when it flips.
 *
 * Built on useSyncExternalStore rather than an effect that copies the value
 * into state, so there is no extra render after mount. The server snapshot is
 * always false, which keeps the first client render identical to the HTML.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
