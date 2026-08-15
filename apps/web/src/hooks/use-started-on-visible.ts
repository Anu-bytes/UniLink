"use client";

import { useEffect, useRef, useState } from "react";

/** Flips true once the ref'd element scrolls into view, then stops observing. Drives count-up animations so they fire on scroll-in rather than page load. */
export function useStartedOnVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, started };
}
