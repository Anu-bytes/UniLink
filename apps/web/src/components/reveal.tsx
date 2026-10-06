"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

import { cn } from "@/lib/utils";

/**
 * Reveals its children with a subtle fade + rise the first time they scroll
 * into view. Pairs with the `.reveal` / `.is-visible` utilities in globals.css
 * so only opacity/transform animate (compositor-friendly).
 *
 * Content is never hidden by the server HTML: it only gets the hidden
 * `.reveal` state once the observer has run on the client and found it off
 * screen. Hiding it up front made sections (testimonials, most visibly) stay
 * blank whenever hydration was slow or a refresh restored the scroll
 * position before scripts ran. Anything already on screen just shows, with
 * no hide-then-fade flash. Reduced motion and missing IntersectionObserver
 * skip the effect entirely. The observer disconnects after the first reveal.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger in milliseconds — handy for animating grids item-by-item. */
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  // "static": as rendered by the server, visible. "armed": off screen, hidden
  // until it scrolls in. "shown": revealed (animates when coming from armed).
  const [phase, setPhase] = useState<"static" | "armed" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") return;

    // The first callback always fires with the current state, which decides
    // between showing in place and arming for a scroll-in.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          observer.disconnect();
        } else {
          setPhase((current) => (current === "static" ? "armed" : current));
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(
        phase !== "static" && "reveal",
        phase === "shown" && "is-visible",
        className,
      )}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
