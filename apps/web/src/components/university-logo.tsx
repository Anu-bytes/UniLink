"use client";

import Image from "next/image";

import { useLightLogo } from "@/hooks/use-light-logo";
import { cn } from "@/lib/utils";

/**
 * Round university mark. Falls back to the UniLink mark when no logo has
 * been uploaded, rather than a generic cap icon or a single arbitrary
 * initial ("E" for "Egypt University...") — every institution without a
 * real logo yet reads as "not uploaded" (the platform's own mark) instead
 * of a placeholder that looks like a broken/missing image.
 */
export function UniversityLogo({
  name,
  logoUrl,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
  /** @deprecated unused now that the fallback is an icon, not initials. */
  textClassName?: string;
}) {
  // White-on-transparent logos vanish on the white badge, so they are
  // recoloured dark (inverted, then hue-rotated back so brand colours stay
  // close to the original), detected from the image itself once it loads.
  const { light, ref } = useLightLogo(logoUrl);

  if (logoUrl) {
    return (
      // The badge (white circle, border, any size/position from `className`)
      // is the wrapper, so recolouring a light logo only touches the logo,
      // never the white background behind it.
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- logos come from arbitrary partner hosts, which next/image would need whitelisted. */}
        <img
          ref={ref}
          src={logoUrl}
          alt=""
          className={cn(
            "size-full object-contain",
            light && "[filter:invert(1)_hue-rotate(180deg)]",
          )}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      title={name}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200",
        className,
      )}
    >
      <Image
        src="/logo/unilink-logo-mark-v2.png"
        alt=""
        width={112}
        height={130}
        className="h-2/3 w-auto object-contain"
      />
    </span>
  );
}
