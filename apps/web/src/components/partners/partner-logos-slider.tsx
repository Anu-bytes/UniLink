import { Building2 } from "lucide-react";

const SLOT_COUNT = 8;

/**
 * A logo-slider strip for university partners, before there are any real
 * ones to show. Every tile is an explicit "Soon" placeholder (dashed
 * border, muted, matching the site's existing ImagePlaceholder convention)
 * rather than a real logo or name, so it never implies a partnership that
 * doesn't exist yet. Swap this out for real logos once partners are signed.
 *
 * Pure CSS marquee (no client JS): the track is the slot list duplicated
 * once, translated exactly -50% on a loop, so it wraps seamlessly. Pauses
 * on hover and under prefers-reduced-motion (see globals.css).
 */
export function PartnerLogosSlider({ label }: { label: string }) {
  const track = [...Array(SLOT_COUNT * 2)];

  return (
    <div
      aria-hidden
      className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="ul-marquee flex w-max items-center gap-5 group-hover:[animation-play-state:paused]">
        {track.map((_, i) => (
          <div
            key={i}
            className="flex h-20 w-40 shrink-0 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400"
          >
            <Building2 className="size-5 shrink-0" aria-hidden />
            <span className="text-sm font-bold uppercase tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
