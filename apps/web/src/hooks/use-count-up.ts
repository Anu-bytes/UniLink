"use client";

import { useEffect, useState } from "react";

/** Animates from 0 to `target` once `started` flips true. Shared by every live stat counter (homepage hero, login panel) so they move in lockstep. */
export function useCountUp(target: number, started: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      // rAF timestamps are the frame start, which can be a hair before `start`;
      // clamp so the first frame never eases to a negative count ("+-17").
      const p = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return value;
}
