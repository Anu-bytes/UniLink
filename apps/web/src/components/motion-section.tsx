"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A section whose decorative animations stop once it scrolls out of view.
 *
 * CSS animations keep ticking on the compositor even when their element is
 * off-screen, so a hero full of drifting layers goes on costing frames for
 * the whole rest of the page. This pauses them instead, and pausing rather
 * than removing means nothing re-triggers or jumps when you scroll back up.
 *
 * Children are rendered by the server; only the observer runs on the client.
 */
export function MotionSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  // Start unpaused so the animations run even if the observer never attaches.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // A margin keeps it running just before it scrolls back into frame, so
      // motion is already underway rather than starting at the edge.
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={cn(className, !inView && "ul-motion-paused")}>
      {children}
    </section>
  );
}
