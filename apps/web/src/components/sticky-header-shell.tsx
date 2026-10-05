"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Renders the sticky <header> and adds a soft shadow once the page is scrolled,
 * so the header lifts off the content, plus a thin reading-progress line along
 * its bottom edge. Uses a single passive scroll listener throttled to one read
 * per frame (no layout thrash, no work while idle); the progress line is
 * written straight to the DOM so scrolling never re-renders the header.
 * Server-rendered header content is passed straight through as children.
 *
 * Named "site-header" for view transitions, so page-to-page animations
 * (components/page-transition.tsx) slide the content, never the header.
 */
export function StickyHeaderShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        // No backdrop-blur: the header is sticky and always on screen, so a
        // backdrop filter re-blurs the strip behind it on every scroll frame.
        "sticky top-0 z-50 border-b bg-background/95 transition-shadow duration-300",
        scrolled
          ? "border-border shadow-[0_6px_24px_-12px_rgba(15,23,42,0.25)]"
          : "border-transparent",
        className,
      )}
    >
      {children}
      <span
        ref={progressRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#1E6DEB] via-[#3B86F7] to-[#F82C1F] rtl:origin-right"
      />
    </header>
  );
}
