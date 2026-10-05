"use client";

import { useEffect } from "react";

/**
 * Feeds the cursor position to whichever `.ul-spotlight` card is under the
 * pointer as --mx / --my (px from its top-left), which globals.css turns into
 * a soft glow that follows the mouse. One listener for the whole page,
 * throttled to a frame, and only for precise pointers (no effect on touch).
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const event = last;
      if (!event) return;
      const card = (event.target as Element | null)?.closest?.<HTMLElement>(".ul-spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
