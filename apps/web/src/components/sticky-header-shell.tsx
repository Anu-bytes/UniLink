"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Renders the sticky <header> and adds a soft shadow once the page is scrolled,
 * so the header lifts off the content. Uses a single passive scroll listener
 * throttled to one read per frame — no layout thrash, no work while idle.
 * Server-rendered header content is passed straight through as children.
 */
export function StickyHeaderShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 8);
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/90 backdrop-blur-sm transition-shadow duration-300",
        scrolled
          ? "border-border shadow-[0_6px_24px_-12px_rgba(15,23,42,0.25)]"
          : "border-transparent",
        className,
      )}
    >
      {children}
    </header>
  );
}
