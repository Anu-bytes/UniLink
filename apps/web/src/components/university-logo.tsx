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
  // White-on-transparent logos vanish on the white badge, so they are swapped
  // for a recoloured copy (white marks dark, brand colours unchanged) once
  // the image has loaded.
  const { src: readableSrc, ref } = useLightLogo(logoUrl);

  if (logoUrl) {
    return (
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- logos come from arbitrary partner hosts, which next/image would need whitelisted. */}
        <img
          ref={ref}
          src={readableSrc ?? logoUrl}
          alt=""
          className="size-full object-contain"
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
