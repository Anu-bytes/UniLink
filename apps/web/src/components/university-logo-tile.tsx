"use client";

import { Link } from "@/i18n/navigation";
import { useLightLogo } from "@/hooks/use-light-logo";
import { cn } from "@/lib/utils";

/**
 * One tile of the homepage logo strip. White-on-transparent logos (they'd
 * be invisible on the white tile) are detected once loaded and recoloured
 * dark: inverted, then hue-rotated back so brand colours stay close to the
 * original.
 */
export function UniversityLogoTile({
  href,
  logoUrl,
  name,
  label,
  hidden,
}: {
  href: string;
  logoUrl: string;
  name: string;
  label: string;
  /** The duplicated half of the marquee: out of the tab order and a11y tree. */
  hidden: boolean;
}) {
  const { light, ref } = useLightLogo(logoUrl);

  return (
    <Link
      href={href}
      tabIndex={hidden ? -1 : undefined}
      aria-label={label}
      title={name}
      className={cn(
        "flex h-16 w-32 items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 opacity-70 shadow-[0_6px_18px_-12px_rgba(15,23,42,0.3)] grayscale-[0.85] transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/30 hover:opacity-100 hover:shadow-[0_16px_30px_-16px_rgba(30,109,235,0.5)] hover:grayscale-0 md:h-20 md:w-40",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small local logos, already optimized */}
      <img
        ref={ref}
        src={logoUrl}
        alt=""
        loading="lazy"
        className={cn(
          "max-h-10 max-w-full object-contain md:max-h-12",
          light && "[filter:invert(1)_hue-rotate(180deg)]",
        )}
      />
    </Link>
  );
}
