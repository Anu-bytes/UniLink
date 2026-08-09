"use client";

import { ExternalLink, Heart, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { useCompare } from "@/components/app/compare-context";
import { UniversityLogo } from "@/components/university-logo";
import { formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";
import { BAND_STYLES } from "@/lib/matching";
import type { ProgramResult } from "@/lib/program-search";
import { cn } from "@/lib/utils";

/**
 * A single search result. Mirrors the ApplyBoard tile: match bar on top, then
 * the identity block, the four-cell fact grid, perk pills, and the action row.
 */
export function ProgramCard({ program }: { program: ProgramResult }) {
  const t = useTranslations("Search");
  const tApp = useTranslations("App");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const compare = useCompare();

  const [saved, setSaved] = useState(program.saved);

  const selected = compare.isSelected(program.id);
  const band = program.match?.band;
  const bandStyle = band ? BAND_STYLES[band] : null;

  const years = yearsFromMonths(program.durationMonths);
  const degreeLabel = years
    ? tCatalog("levelWithYears", {
        years,
        level: tCatalog(`levels.${program.studyLevel}`),
      })
    : tCatalog(`levels.${program.studyLevel}`);

  const tuition = formatMoney(locale, program.tuitionFee, program.currency);
  const applicationFee = program.applicationFeeWaived
    ? t("card.waived")
    : formatMoney(locale, program.applicationFee, program.currency);

  const nextIntake = program.intakes[0];

  async function toggleSaved() {
    const next = !saved;
    setSaved(next);
    try {
      const response = await fetch("/api/saved", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId: program.id }),
      });
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      console.error("Unable to update saved programs", error);
      setSaved(!next);
    }
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {program.match && bandStyle ? (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E6DEB]">
              {t("card.successChance")}
            </span>
            {/* Colour lives in the dot; the label itself stays navy so the row
                reads as one line rather than four different colours. */}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2A44]">
              <span className={cn("size-1.5 rounded-full", bandStyle.dot)} />
              {t(`bands.${program.match.band}`)}
            </span>
          </div>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="meter"
            aria-valuenow={program.match.score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("card.successChance")}
          >
            <div
              className={cn("h-full rounded-full", bandStyle.bar)}
              style={{ width: `${program.match.score}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <UniversityLogo
            name={program.university.name}
            logoUrl={program.university.logoUrl}
            className="size-9"
            textClassName="text-xs"
          />
          <div className="min-w-0">
            <Link
              href={`/universities/${program.university.slug}/programs/${program.slug}`}
              className="text-sm font-bold leading-snug text-[#1E6DEB] underline-offset-2 hover:underline"
            >
              {program.name}
            </Link>
            <p className="mt-0.5 text-xs text-[#5a6072]">{degreeLabel}</p>
          </div>
        </div>

        <Link
          href={`/universities/${program.university.slug}`}
          className="mt-3 block text-sm font-semibold text-[#1E6DEB] underline-offset-2 hover:underline"
        >
          {program.university.name}
        </Link>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[#5a6072]">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {program.university.city}, {program.university.country}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <div>
            <dt className="font-semibold uppercase tracking-wide text-[#98A0B4]">
              {t("card.tuition")}
            </dt>
            <dd className="mt-0.5 font-semibold text-[#1F2A44]">
              {tuition
                ? `${tuition}${tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}`
                : t("card.notSpecified")}
            </dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-[#98A0B4]">
              {t("card.applicationFee")}
            </dt>
            <dd className="mt-0.5 font-semibold text-[#1F2A44]">
              {applicationFee ?? t("card.notSpecified")}
            </dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-[#98A0B4]">
              {t("card.duration")}
            </dt>
            <dd className="mt-0.5 font-semibold text-[#1F2A44]">
              {program.durationLabel ??
                (years
                  ? tCatalog("durationYears", {
                      count: years,
                      value: formatNumber(locale, years),
                    })
                  : t("card.notSpecified"))}
            </dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-[#98A0B4]">
              {t("card.intake")}
            </dt>
            <dd className="mt-0.5 font-semibold text-[#1F2A44]">
              {nextIntake
                ? `${tCatalog(`seasons.${nextIntake.season}`)} ${nextIntake.year}`
                : t("card.notSpecified")}
            </dd>
          </div>
        </dl>

        {program.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {program.tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-[#EEF3FF] px-2 py-1 text-[11px] font-semibold text-[#1E3A8A]"
              >
                {tCatalog(`tags.${tag}`)}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleSaved}
              aria-pressed={saved}
              aria-label={saved ? t("card.unsave") : t("card.save")}
              title={saved ? t("card.unsave") : t("card.save")}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                saved
                  ? "border-[#F82C1F] bg-[#FFF0EE] text-[#F82C1F]"
                  : "border-slate-200 text-[#5a6072] hover:bg-slate-50",
              )}
            >
              <Heart
                className={cn("size-4", saved && "fill-current")}
                aria-hidden
              />
            </button>

            {/* Details is the primary action: it is the step every student
                takes, whereas starting an application is a later commitment
                and its tracking is still in preview. */}
            <Link
              href={`/universities/${program.university.slug}/programs/${program.slug}`}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#1E6DEB] text-sm font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              {t("card.details")}
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() =>
                compare.toggle({
                  id: program.id,
                  name: program.name,
                  universityName: program.university.name,
                  logoUrl: program.university.logoUrl,
                })
              }
              disabled={!selected && compare.isFull}
              aria-pressed={selected}
              className={cn(
                "h-10 flex-1 rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
                  : "border-slate-200 text-[#1F2A44] hover:bg-slate-50",
              )}
            >
              {selected ? t("card.comparing") : t("card.compare")}
            </button>

            {/* Disabled until applications leave preview. POST /api/applications
                still exists and works, so re-enabling means restoring an
                onClick that posts the program id and flipping this back to a
                filled button. */}
            <button
              type="button"
              disabled
              className="inline-flex h-10 flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 text-sm font-semibold text-[#98A0B4]"
            >
              {t("card.startApplication")}
              <span className="rounded-full bg-[#FFF6E5] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B77714]">
                {tApp("comingSoon")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
