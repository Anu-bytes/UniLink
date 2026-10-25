import { GraduationCap, LocateFixed, Navigation } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A drawn (not live) UniLink map: streets, a search circle around "you",
 * university pins dropping in and a dashed route to the nearest. Used on the
 * homepage section and behind the sign-in prompt, so no map tiles or real
 * locations are involved.
 */
export function NearbyArt({
  youLabel,
  distanceLabel,
  foundLabel,
  nearestLabel,
  className,
}: {
  youLabel: string;
  distanceLabel: string;
  foundLabel: string;
  nearestLabel: string;
  className?: string;
}) {
  // Pins as % positions over the drawing; the first one is the nearest.
  const pins = [
    { x: 66, y: 34, delay: 0.15 },
    { x: 24, y: 26, delay: 0.3 },
    { x: 80, y: 66, delay: 0.45 },
    { x: 30, y: 74, delay: 0.6 },
    { x: 52, y: 20, delay: 0.75 },
  ];

  return (
    <div
      aria-hidden
      className={cn(
        "ul-art relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-[#EEF3FB] ring-1 ring-[#DCE6F7]",
        className,
      )}
    >
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {/* City blocks */}
        <g fill="#E3EBF8">
          <rect x="18" y="20" width="70" height="44" rx="8" />
          <rect x="104" y="20" width="96" height="44" rx="8" />
          <rect x="216" y="20" width="58" height="62" rx="8" />
          <rect x="292" y="20" width="92" height="40" rx="8" />
          <rect x="18" y="82" width="54" height="80" rx="8" />
          <rect x="292" y="78" width="92" height="70" rx="8" />
          <rect x="18" y="180" width="80" height="50" rx="8" />
          <rect x="250" y="168" width="60" height="58" rx="8" />
          <rect x="326" y="166" width="58" height="114" rx="8" />
          <rect x="18" y="248" width="120" height="40" rx="8" />
          <rect x="156" y="244" width="76" height="44" rx="8" />
        </g>
        {/* Park */}
        <rect x="112" y="186" width="96" height="40" rx="12" fill="#DDF1E6" />
        {/* River */}
        <path d="M-10 150 C 70 130, 120 170, 190 150 S 320 120, 410 150" fill="none" stroke="#CFE0FB" strokeWidth="16" strokeLinecap="round" />
        {/* Streets */}
        <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
          <path d="M0 72 H400" strokeWidth="9" />
          <path d="M0 238 H400" strokeWidth="9" />
          <path d="M96 0 V300" strokeWidth="9" />
          <path d="M284 0 V300" strokeWidth="9" />
          <path d="M210 0 V140 M240 160 V300" strokeWidth="6" />
          <path d="M0 174 H90 M110 178 H400" strokeWidth="5" />
        </g>
        {/* Search radius around the visitor */}
        <circle cx="168" cy="150" r="112" fill="#1E6DEB" fillOpacity="0.06" stroke="#1E6DEB" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="6 6" className="ul-art-radius" />
        {/* Route to the nearest pin */}
        <path d="M168 150 C 200 130, 236 118, 264 108" fill="none" stroke="#F82C1F" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" className="ul-route" />
      </svg>

      {/* The visitor */}
      <span className="absolute left-[42%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="ul-me-halo absolute -inset-4 rounded-full" />
        <span className="relative flex size-6 items-center justify-center rounded-full border-[3px] border-white bg-[#1E6DEB] shadow-[0_4px_12px_-2px_rgba(30,109,235,0.8)]" />
        <span className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1E6DEB] px-2 py-0.5 text-[11px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(30,109,235,0.9)]">
          {youLabel}
        </span>
      </span>

      {/* Distance chip on the route */}
      <span className="ul-art-chip absolute left-[54%] top-[34%] -translate-x-1/2 rounded-full bg-[#F82C1F] px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(248,44,31,0.9)]">
        {distanceLabel}
      </span>

      {pins.map((pin, index) => (
        <span
          key={index}
          className="ul-art-pin absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%`, animationDelay: `${pin.delay}s` }}
        >
          <span className="relative flex flex-col items-center">
            {index === 0 ? <span className="ul-pin-pulse !left-0 !top-0 !size-10" /> : null}
            <span
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full bg-white shadow-[0_10px_20px_-8px_rgba(15,23,42,0.5)]",
                index === 0 ? "ring-[3px] ring-[#F82C1F]" : "ring-[3px] ring-[#1E6DEB]",
              )}
            >
              <GraduationCap className={cn("size-5", index === 0 ? "text-[#F82C1F]" : "text-[#1E6DEB]")} />
            </span>
            <span
              className={cn(
                "-mt-px h-0 w-0 border-x-[7px] border-t-[10px] border-x-transparent",
                index === 0 ? "border-t-[#F82C1F]" : "border-t-[#1E6DEB]",
              )}
            />
            <span
              className={cn(
                "absolute -end-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold text-white ring-2 ring-white",
                index === 0 ? "bg-[#F82C1F]" : "bg-[#1E6DEB]",
              )}
            >
              {index + 1}
            </span>
          </span>
        </span>
      ))}

      {/* Floating result card */}
      <div className="ul-art-card absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.6)] ring-1 ring-black/5 sm:inset-x-auto sm:end-4 sm:w-[300px]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white">
          <LocateFixed className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] font-extrabold leading-snug text-[#16233F]">{foundLabel}</span>
          <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-semibold text-[#F82C1F]">
            <Navigation className="size-3 shrink-0" />
            {nearestLabel}
          </span>
        </span>
      </div>
    </div>
  );
}
