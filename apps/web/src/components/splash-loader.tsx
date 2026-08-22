import { cn } from "@/lib/utils";

/**
 * The UniLink "U" mark, cut into its four coloured pieces and thrown back
 * together from the corners. Every piece is the same mark PNG under a
 * different clip region, so the assembled frame is the real logo rather than a
 * hand-traced copy that would drift out of sync when the brand asset changes.
 *
 * Pure CSS (see `.ul-splash*` in globals.css), so it renders on the server and
 * costs nothing to hydrate.
 */
export function SplashMark({
  size = "6rem",
  className,
}: {
  /**
   * Height the "U" itself draws at, any CSS length. The element is sized to
   * the mark's own bounding box, so this is the real glyph height rather
   * than the height of a padded square.
   */
  size?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("ul-splash", className)}
      style={{ "--ul-splash-size": size } as React.CSSProperties}
    >
      <span className="ul-splash-glow" />

      {/* Staggered so the four pieces land in sequence instead of in lockstep. */}
      <span className="ul-splash-piece ul-splash-piece-1" />
      <span
        className="ul-splash-piece ul-splash-piece-2"
        style={{ "--ul-splash-delay": "90ms" } as React.CSSProperties}
      />
      <span
        className="ul-splash-piece ul-splash-piece-3"
        style={{ "--ul-splash-delay": "180ms" } as React.CSSProperties}
      />
      <span
        className="ul-splash-piece ul-splash-piece-4"
        style={{ "--ul-splash-delay": "270ms" } as React.CSSProperties}
      />

      {/* Ripple and droplets fire just after the last piece lands. */}
      <span
        className="ul-splash-ring"
        style={{ "--ul-splash-delay": "250ms" } as React.CSSProperties}
      />
      {DROPLETS.map((drop, index) => (
        <span
          key={index}
          className="ul-splash-drop"
          style={
            {
              "--ul-dx": drop.dx,
              "--ul-dy": drop.dy,
              "--ul-drop-color": drop.color,
              "--ul-splash-delay": drop.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

const DROPLETS = [
  { dx: "-165%", dy: "-30%", color: "#1e6deb", delay: "240ms" },
  { dx: "150%", dy: "-75%", color: "#f82c1f", delay: "290ms" },
  { dx: "35%", dy: "150%", color: "#1e6deb", delay: "330ms" },
] as const;

/**
 * The mark plus a status label, announced to assistive tech as a live region.
 */
export function SplashLoader({
  label,
  size = "6rem",
  className,
}: {
  label?: string;
  size?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("flex flex-col items-center justify-center gap-4", className)}
    >
      <SplashMark size={size} />

      {label ? (
        <p className="flex items-center gap-1 text-sm font-semibold text-[#5a6072]">
          <span>{label}</span>
          <span aria-hidden className="flex items-center gap-0.5 ps-0.5">
            {["0ms", "160ms", "320ms"].map((delay) => (
              <span
                key={delay}
                className="ul-splash-dot inline-block size-1 rounded-full bg-[#1E6DEB]"
                style={{ "--ul-splash-delay": delay } as React.CSSProperties}
              />
            ))}
          </span>
        </p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}

/**
 * Full-bleed version for route-level `loading.tsx` files, where the splash is
 * the only thing on screen.
 */
export function SplashScreen({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center px-6 py-20">
      <SplashLoader label={label} size="8.5rem" />
    </div>
  );
}
