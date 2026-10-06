import { cn } from "@/lib/utils";

const VARIANTS = {
  /** On white cards. */
  soft: "bg-[#EEF3FF] text-[#1E6DEB] ring-1 ring-inset ring-[#1E6DEB]/25",
  /** Over photos and gradients: solid white, so it stays legible on any image. */
  solid: "bg-white text-[#1E6DEB] shadow-sm ring-1 ring-black/5",
} as const;

const SIZES = {
  sm: "rounded px-1.5 py-[3px] text-[10px]",
  md: "rounded-md px-2 py-1 text-[11px]",
  lg: "rounded-lg px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm",
} as const;

/**
 * A university's short name ("BUE", "GUC") as a badge, so it reads at a
 * glance instead of trailing the full name as small grey "(BUE)" text.
 * Latin letters even on the Arabic site (that's how these are written and
 * recognised locally), so the text is forced left-to-right rather than
 * flipping with the page direction. Only the inner text gets `dir="ltr"`:
 * logical position classes passed in (`start-3`, `end-3`) resolve against
 * the element's own direction, so on the badge itself they would point the
 * wrong way on the Arabic site.
 */
export function AcronymBadge({
  acronym,
  variant = "soft",
  size = "md",
  className,
}: {
  acronym: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center font-extrabold uppercase leading-none tracking-wider",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      <span dir="ltr">{acronym}</span>
    </span>
  );
}
