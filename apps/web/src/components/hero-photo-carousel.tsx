"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/** `src: null` renders a branded placeholder tile instead of a photo, for a
 * slot that doesn't have a real photo yet. */
export type HeroPhoto = { src: string | null; alt: string };

// How long each photo stays up before crossfading to the next.
const ROTATE_INTERVAL_MS = 4500;

/**
 * The hero's photo, crossfading between `photos` on a timer. Pauses (shows
 * only the first photo) under prefers-reduced-motion. The dots double as
 * manual controls — clicking one also restarts the timer, so a manual pick
 * doesn't get immediately overridden by the next scheduled tick.
 */
export function HeroPhotoCarousel({ photos }: { photos: HeroPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || photos.length <= 1) return;
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [reducedMotion, photos.length, index]);

  return (
    <>
      {photos.map((photo, i) => {
        const fadeClass = cn(
          "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
          i === index ? "opacity-100" : "opacity-0",
        );

        if (!photo.src) {
          return (
            <div
              key={i}
              aria-hidden
              className={cn(
                fadeClass,
                "flex items-center justify-center bg-gradient-to-br from-[#EAF1FF] to-[#DCE7FA]",
              )}
            >
              <ImageIcon
                className="size-10 text-[#1E6DEB]/25"
                strokeWidth={1.5}
              />
            </div>
          );
        }

        return (
          <Image
            key={i}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 33rem"
            // `fill` images render without width/height attributes (they're
            // absolutely positioned to match the parent, which already has
            // aspect-[5/4] — see page.tsx), so lazy-loaded ones here trip the
            // "explicit dimensions" audit. Matching the ratio on the element
            // itself satisfies that with no layout effect: position:absolute
            // takes it out of flow, so its own aspect-ratio is a no-op for
            // real rendering.
            className={cn(fadeClass, "aspect-[5/4] object-cover")}
            priority={i === 0}
          />
        );
      })}

      {photos.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "pointer-events-auto h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75",
              )}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
