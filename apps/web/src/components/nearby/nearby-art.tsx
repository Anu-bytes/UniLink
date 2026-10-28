import { ChevronDown, LocateFixed, Minus, Plus } from "lucide-react";

import { UniversityLogo } from "@/components/university-logo";
import type { NearbyUniversity } from "@/lib/nearby";
import { cn } from "@/lib/utils";

/** Tahrir Square: the example starting point for the homepage preview. */
export const PREVIEW_ORIGIN = { lat: 30.0444, lng: 31.2357 };

export type PreviewItem = {
  slug: string;
  name: string;
  logoUrl: string | null;
  city: string;
  km: number;
  /** Position over the drawn map, in % of its box. */
  x: number;
  y: number;
};

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/**
 * The nearest mapped universities to the example point, laid out by their
 * real coordinates so the preview matches what the live map would show.
 */
export function previewItems(universities: NearbyUniversity[], count = 4): { items: PreviewItem[]; origin: { x: number; y: number } } {
  const near = universities
    .filter((u) => u.lat !== null && u.lng !== null)
    .map((u) => ({ u, km: km(PREVIEW_ORIGIN, { lat: u.lat!, lng: u.lng! }) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count);

  const lats = [PREVIEW_ORIGIN.lat, ...near.map((n) => n.u.lat!)];
  const lngs = [PREVIEW_ORIGIN.lng, ...near.map((n) => n.u.lng!)];
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  // Keep a margin so pins and their labels stay inside the frame.
  const project = (lat: number, lng: number) => ({
    x: 14 + ((lng - minLng) / (maxLng - minLng || 1)) * 72,
    y: 20 + (1 - (lat - minLat) / (maxLat - minLat || 1)) * 60,
  });

  return {
    origin: project(PREVIEW_ORIGIN.lat, PREVIEW_ORIGIN.lng),
    items: near.map(({ u, km: distance }) => ({
      slug: u.slug,
      name: u.name,
      logoUrl: u.logoUrl,
      city: u.city,
      km: distance,
      ...project(u.lat!, u.lng!),
    })),
  };
}

/**
 * A still, product-accurate preview of the /nearby screen: filter pills, the
 * results list and the map with pins, the visitor's dot and the route to the
 * nearest. Motion is CSS only (pins settle, the radius sweeps).
 */
export function NearbyPreview({
  items,
  origin,
  labels,
  className,
}: {
  items: PreviewItem[];
  origin: { x: number; y: number };
  labels: {
    from: string;
    field: string;
    distance: string;
    count: string;
    context: string;
    you: string;
    nearest: string;
    km: (value: number) => string;
  };
  className?: string;
}) {
  const nearest = items[0];

  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.45),0_0_0_1px_rgba(15,23,42,0.07)]",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5">
        <Pill active icon={<LocateFixed className="size-3.5" />}>
          {labels.from}
        </Pill>
        <span className="mx-0.5 h-4 w-px bg-slate-200" />
        <Pill active>{labels.field}</Pill>
        <Pill>{labels.distance}</Pill>
      </div>

      <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* List */}
        <div className="border-e border-slate-200">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[13px] font-semibold text-slate-900">{labels.count}</p>
            <p className="mt-0.5 truncate text-[11px] text-slate-500">{labels.context}</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <li
                key={item.slug}
                className={cn("ul-rise flex items-center gap-2.5 px-4 py-2.5", index === 0 && "bg-slate-50")}
                style={{ "--rise-delay": `${300 + index * 90}ms` } as React.CSSProperties}
              >
                <UniversityLogo name={item.name} logoUrl={item.logoUrl} className="size-8 border-slate-200 p-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium text-slate-900">{item.name}</span>
                  <span className="block truncate text-[10.5px] text-slate-500">{item.city}</span>
                </span>
                <span className="shrink-0 text-[12px] font-semibold tabular-nums text-slate-900">{labels.km(item.km)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="relative min-h-[300px] overflow-hidden bg-[#ECEFF3] sm:min-h-[340px]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <g fill="#E3E7EC">
              <rect x="4" y="6" width="22" height="14" rx="1.5" />
              <rect x="30" y="4" width="18" height="20" rx="1.5" />
              <rect x="56" y="8" width="26" height="12" rx="1.5" />
              <rect x="6" y="30" width="16" height="22" rx="1.5" />
              <rect x="62" y="30" width="30" height="16" rx="1.5" />
              <rect x="8" y="62" width="24" height="16" rx="1.5" />
              <rect x="40" y="70" width="20" height="24" rx="1.5" />
              <rect x="68" y="58" width="26" height="30" rx="1.5" />
            </g>
            <path d="M38 -5 C 44 20, 36 40, 44 60 S 40 90, 46 110" fill="none" stroke="#D6E2F2" strokeWidth="4" />
            <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
              <path d="M0 26 H100 M0 56 H100 M0 86 H100" strokeWidth="1.6" />
              <path d="M28 0 V100 M54 0 V100 M86 0 V100" strokeWidth="1.6" />
              <path d="M0 8 L100 70" strokeWidth="1" />
            </g>
          </svg>

          {/* Radius sweep and route, drawn in % of the box. */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <circle cx={origin.x} cy={origin.y} r="38" fill="#1E6DEB" fillOpacity="0.05" stroke="#1E6DEB" strokeOpacity="0.4" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
            <circle cx={origin.x} cy={origin.y} r="38" fill="#1E6DEB" fillOpacity="0.08" className="ul-art-sweep" />
            {nearest ? (
              <line
                x1={origin.x}
                y1={origin.y}
                x2={nearest.x}
                y2={nearest.y - 4}
                stroke="#0F172A"
                strokeOpacity="0.7"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="ul-art-route"
              />
            ) : null}
          </svg>

          {nearest ? (
            <span
              className="ul-rise absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-900/5 bg-white px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-900 shadow-sm"
              style={{
                // A third of the way along, clear of the pin's own label.
                left: `${origin.x + (nearest.x - origin.x) * 0.38}%`,
                top: `${origin.y + (nearest.y - 4 - origin.y) * 0.38}%`,
                "--rise-delay": "900ms",
              } as React.CSSProperties}
            >
              {labels.km(nearest.km)}
            </span>
          ) : null}

          {/* The visitor */}
          <span className="absolute size-[18px] -translate-x-1/2 -translate-y-1/2" style={{ left: `${origin.x}%`, top: `${origin.y}%` }}>
            <span className="ul-me-halo" />
            <span className="ul-me-dot" />
          </span>

          {items.map((item, index) => (
            <span
              key={item.slug}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <span
                className={cn("ul-art-pin ul-pin !h-auto !w-auto", index === 0 && "is-selected")}
                style={{ "--pin-delay": `${200 + index * 110}ms` } as React.CSSProperties}
              >
                <span className="ul-pin-head !size-9">
                  <UniversityLogo name={item.name} logoUrl={item.logoUrl} className="size-full border-0 p-1" />
                </span>
                <span className="ul-pin-tail" />
                {index === 0 ? (
                  <span className="ul-pin-label !max-w-[180px] !text-[11px]">
                    <span className="ul-pin-name">{labels.nearest}</span>
                  </span>
                ) : null}
              </span>
            </span>
          ))}

          <div className="absolute end-2.5 top-2.5 flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)]">
            <span className="flex size-7 items-center justify-center text-slate-500"><Plus className="size-3.5" /></span>
            <span className="mx-1.5 h-px bg-slate-100" />
            <span className="flex size-7 items-center justify-center text-slate-500"><Minus className="size-3.5" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ active = false, icon, children }: { active?: boolean; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11.5px] font-medium",
        active ? "border-[#1E6DEB]/30 bg-[#EFF5FF] text-[#1E6DEB]" : "border-slate-200 text-slate-600",
      )}
    >
      {icon}
      <span className="max-w-[120px] truncate">{children}</span>
      <ChevronDown className="size-3 opacity-60" />
    </span>
  );
}
