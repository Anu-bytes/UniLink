"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/** `src: null` renders a branded placeholder tile instead of a photo, for a
 * slot that doesn't have a real photo yet. `badge` overlays a short pill of
 * copy on that slide only, for a photo worth calling out specifically (e.g.
 * a product screenshot) rather than every slide getting the same caption.
 * `badgePosition` defaults to the top-start corner; some photos already have
 * their own content up there, so a slide can move its badge to bottom-start
 * instead rather than sitting on top of that content. */
export type HeroPhoto = {
  src: string | null;
  alt: string;
  badge?: string;
  badgePosition?: "top" | "bottom";
};

// How long each photo stays up before crossfading to the next.
const ROTATE_INTERVAL_MS = 4500;

/**
 * The hero's photo, crossfading between `photos` on a timer. Still advances
 * under prefers-reduced-motion — the fade itself is skipped there (see
 * `motion-reduce:transition-none` on the fade class below, an instant cut
 * instead of a smooth crossfade), but the slides keep rotating. Freezing on
 * the first photo forever isn't what reduced-motion is for (it exists to
 * drop *animation*, not to keep users from ever seeing the other slides),
 * and iOS Safari's Private Browsing has been observed reporting reduced
 * motion as on when the user never asked for it. The dots double as manual
 * controls — clicking one also restarts the timer, so a manual pick doesn't
 * get immediately overridden by the next scheduled tick.
 */
export function HeroPhotoCarousel({ photos }: { photos: HeroPhoto[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [photos.length, index]);

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

      {photos.map((photo, i) =>
        photo.badge ? (
          <div
            key={`badge-${i}`}
            aria-hidden={i !== index}
            className={cn(
              "pointer-events-none absolute start-3 flex max-w-[calc(100%-1.5rem)] items-start gap-1.5 rounded-2xl bg-white px-3 py-1.5 text-[11px] font-bold leading-snug text-[#1E3A8A] shadow-lg transition-opacity duration-1000 ease-in-out motion-reduce:transition-none sm:items-center sm:rounded-full sm:text-xs",
              photo.badgePosition === "bottom" ? "bottom-11" : "top-4",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-[#F5A623] sm:mt-0" aria-hidden />
            <span className="sm:truncate">{photo.badge}</span>
          </div>
        ) : null,
      )}

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
