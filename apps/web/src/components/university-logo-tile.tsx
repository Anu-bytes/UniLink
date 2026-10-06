"use client";

import { Link } from "@/i18n/navigation";
import { useLightLogo } from "@/hooks/use-light-logo";
import { cn } from "@/lib/utils";

/**
 * One tile of the homepage logo strip, always in full colour.
 * White-on-transparent logos (they would vanish on the white tile) are
 * swapped for a recoloured copy once loaded: their white marks turn dark and
 * their brand colours stay as they are (see useLightLogo).
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
  const { src: readableSrc, ref } = useLightLogo(logoUrl);

  return (
    <Link
      href={href}
      tabIndex={hidden ? -1 : undefined}
      aria-label={label}
      title={name}
      className={cn(
        "flex h-16 w-32 items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 shadow-[0_6px_18px_-12px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/30 hover:shadow-[0_16px_30px_-16px_rgba(30,109,235,0.5)] md:h-20 md:w-40",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small local logos, already optimized */}
      <img
        ref={ref}
        src={readableSrc ?? logoUrl}
        alt=""
        loading="lazy"
        className="max-h-10 max-w-full object-contain md:max-h-12"
      />
    </Link>
  );
}
