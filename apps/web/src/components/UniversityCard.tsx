"use client";

import { useState } from "react";
import { MapPin, Star, Heart } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { LocaleLink } from "./LocaleLink";
import { VerifiedBadge } from "./ui/VerifiedBadge";
import { Tag } from "./ui/Chip";
import { pick, formatFeeRange, formatDistance, formatNumber } from "@/lib/format";
import { getField } from "@/data/fields";
import { cn } from "@/lib/cn";
import type { UniversitySummary } from "@/lib/types";

export function UniversityCard({ u, compact = false }: { u: UniversitySummary; compact?: boolean }) {
  const { locale, m } = useIntl();
  const [saved, setSaved] = useState(false);

  const initials = pick(u.name, "en")
    .split(" ")
    .filter((w) => !["the", "of", "in"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <LocaleLink
      href={`/universities/${u.slug}`}
      className="group flex flex-col rounded-card border border-line bg-surface p-4 transition-shadow hover:shadow-[0_12px_28px_-12px_rgba(11,18,32,0.18)]"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-head text-base font-bold text-brand-600">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-head text-base font-semibold leading-tight text-ink group-hover:text-brand">
              {pick(u.name, locale)}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setSaved((s) => !s);
              }}
              aria-label={m.common.save}
              className="shrink-0 text-muted hover:text-accent"
            >
              <Heart className={cn("size-5", saved && "fill-accent text-accent")} />
            </button>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-3.5" aria-hidden />
            {pick(u.city, locale)}
            <span className="mx-1 text-line">·</span>
            <Star className="size-3.5 fill-warning text-warning" aria-hidden />
            {formatNumber(u.rating, locale)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {u.isVerified && <VerifiedBadge label={m.common.verified} />}
        {u.topFields.slice(0, compact ? 1 : 2).map((f) => (
          <Tag key={f}>{pick(getField(f).name, locale)}</Tag>
        ))}
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="text-xs text-muted">{m.common.from}</p>
          <p className="font-head text-sm font-semibold text-ink">
            {formatFeeRange(u.minFees, u.maxFees, locale)}
          </p>
        </div>
        <div className="text-end text-xs text-muted">
          <p>{formatNumber(u.programCount, locale)} {m.search.programsCount}</p>
          {u.distanceKm != null && (
            <p className="font-medium text-brand-600">
              {formatDistance(u.distanceKm, locale)} {m.common.away}
            </p>
          )}
        </div>
      </div>
    </LocaleLink>
  );
}
