import { GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Round university mark. Falls back to a brand-gradient cap icon when no
 * logo has been uploaded — a single arbitrary initial ("E" for "Egypt
 * University...") reads as a placeholder rather than an identity, so every
 * institution without a real logo shares this mark instead.
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
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logos come from
      // arbitrary partner hosts, which next/image would need whitelisted.
      <img
        src={logoUrl}
        alt=""
        className={cn(
          "size-10 shrink-0 rounded-full border border-slate-200 bg-white object-contain p-1",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      title={name}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white shadow-sm",
        className,
      )}
    >
      <GraduationCap className="size-1/2" strokeWidth={2} />
    </span>
  );
}
