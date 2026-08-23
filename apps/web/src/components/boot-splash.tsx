"use client";

import { useEffect, useState } from "react";

import { SplashMark } from "@/components/splash-loader";

/**
 * How long the splash stays up before it starts fading, even on an instant
 * load. A 60ms flash of a logo reads as a glitch; holding briefly makes it
 * read as intentional.
 */
const MIN_VISIBLE_MS = 600;

/** Matches the fade in `.ul-boot[data-ready]`. */
const FADE_MS = 450;

/**
 * The splash shown while the site itself is loading.
 *
 * This is a client component, which Next.js still renders on the server, so
 * the markup is in the initial HTML and is painted before React hydrates.
 * That is the whole point: a route-level `loading.tsx` is a Suspense fallback
 * and can only cover a server render wait, never the browser's own navigation,
 * asset download and hydration.
 *
 * Dismissal is belt-and-braces. This component drops it once React is running,
 * and `.ul-boot` also carries a pure-CSS failsafe that hides it at 5s, so a
 * hydration error cannot strand a white overlay over the live site.
 */
export function BootSplash({ label }: { label: string }) {
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setReady(true), MIN_VISIBLE_MS);
    // Unmount after the fade so nothing is left covering the page.
    const drop = setTimeout(() => setGone(true), MIN_VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(drop);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="ul-boot"
      // Present only once dismissal has started, which is what the CSS keys on.
      data-ready={ready ? "" : undefined}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <SplashMark size="8rem" />
    </div>
  );
}
