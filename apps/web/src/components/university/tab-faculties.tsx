"use client";

import {
  ArrowUpRight,
  Banknote,
  BadgePercent,
  GraduationCap,
  Lock,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { EmptySection } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";
import { cn } from "@/lib/utils";

type T = ReturnType<typeof useTranslations>;
type Program = UniversityDetailData["faculties"][number]["programs"][number];

const TAG_ICONS: Record<string, LucideIcon> = {
  WAIVED_APPLICATION_FEE: Banknote,
  SCHOLARSHIPS_AVAILABLE: BadgePercent,
  FAST_ACCEPTANCE: Zap,
  HIGH_JOB_DEMAND: GraduationCap,
  FINANCIAL_AID_AVAILABLE: Banknote,
  CREDIT_HOURS: GraduationCap,
};

/**
 * Faculty names, descriptions and program counts stay public (they're what
 * the directory and search results already show); the actual program list
 * inside each faculty needs an account, same as admission requirements,
 * criteria, scores and tuition elsewhere on this page.
 *
 * Faculties are pill tabs rather than a stack of accordions: with several
 * faculties each holding several programs, expanding one used to leave the
 * rest of the page as a wall of collapsed panels and made the tab feel huge
 * even before the gating overlay. Only the selected faculty's programs
 * render at a time, as a card grid instead of a plain divided list, so
 * browsing reads as picking a program rather than scanning a long table.
 */
export function TabFaculties({
  university,
  isAuthenticated,
  callbackUrl,
}: {
  university: UniversityDetailData;
  isAuthenticated: boolean;
  callbackUrl: string;
}) {
  const t = useTranslations("UniversityDetail");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const [activeId, setActiveId] = useState(university.faculties[0]?.id);

  if (university.faculties.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  const active =
    university.faculties.find((faculty) => faculty.id === activeId) ??
    university.faculties[0];

  return (
    <div>
      {university.faculties.length > 1 ? (
        <div
          role="tablist"
          aria-label={t("facultiesHeading")}
          className="flex flex-nowrap gap-2 overflow-x-auto pb-1"
        >
          {university.faculties.map((faculty) => {
            const isActive = faculty.id === active.id;
            return (
              <button
                key={faculty.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(faculty.id)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                  isActive
                    ? "bg-[#1E3A8A] text-white shadow-sm"
                    : "border border-slate-200 text-[#5a6072] hover:border-[#1E6DEB]/40 hover:text-[#1E6DEB]",
                )}
              >
                {faculty.name}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-[#EEF3FF] text-[#1E6DEB]",
                  )}
                >
                  {formatNumber(locale, faculty.programs.length)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <h2 className="text-lg font-bold text-[#1F2A44] md:text-xl">
          {active.name}
        </h2>
      )}

      <div className={university.faculties.length > 1 ? "mt-6" : "mt-4"}>
        {active.description ? (
          <p className="mb-6 text-base leading-7 text-[#5a6072]">
            {active.description}
          </p>
        ) : null}

        {active.programs.length === 0 ? (
          <EmptySection message={t("emptySection")} />
        ) : isAuthenticated ? (
          <ProgramGrid
            programs={active.programs}
            universitySlug={university.slug}
            locale={locale}
            t={t}
            tCatalog={tCatalog}
          />
        ) : (
          <div className="relative">
            <div aria-hidden className="pointer-events-none select-none blur-sm">
              <ProgramGrid
                programs={active.programs}
                universitySlug={university.slug}
                locale={locale}
                t={t}
                tCatalog={tCatalog}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-4">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-[#1E6DEB] shadow-md transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                <Lock className="size-4 shrink-0" aria-hidden />
                {t("programsLocked")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgramGrid({
  programs,
  universitySlug,
  locale,
  t,
  tCatalog,
}: {
  programs: Program[];
  universitySlug: string;
  locale: string;
  t: T;
  tCatalog: T;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          universitySlug={universitySlug}
          locale={locale}
          t={t}
          tCatalog={tCatalog}
        />
      ))}
    </div>
  );
}

function ProgramCard({
  program,
  universitySlug,
  locale,
  t,
  tCatalog,
}: {
  program: Program;
  universitySlug: string;
  locale: string;
  t: T;
  tCatalog: T;
}) {
  const years = yearsFromMonths(program.durationMonths);
  const tuition = formatMoney(locale, program.tuitionFee, program.currency);

  return (
    <Link
      href={`/universities/${universitySlug}/programs/${program.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#1E6DEB]">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          {program.tags.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-1.5">
              {program.tags.slice(0, 2).map((tag) => {
                const TagIcon = TAG_ICONS[tag];
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FFF6E5] px-2 py-1 text-[11px] font-bold leading-none text-[#B77714]"
                  >
                    {TagIcon ? <TagIcon className="size-3" aria-hidden /> : null}
                    {tCatalog(`tags.${tag}`)}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug text-[#1F2A44]">
          {program.name}
        </h3>
        <p className="mt-1 text-sm text-[#5a6072]">
          {tCatalog(`levels.${program.studyLevel}`)}
          {years
            ? ` · ${tCatalog("durationYears", {
                count: years,
                value: formatNumber(locale, years),
              })}`
            : null}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2 border-t border-slate-100 pt-4">
        {tuition ? (
          <p className="text-base font-bold text-[#1F2A44]">
            {tuition}
            <span className="ms-1 text-xs font-normal text-[#5a6072]">
              {tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}
            </span>
          </p>
        ) : (
          <span />
        )}
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-[#1E6DEB] transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
          {t("viewProgram")}
          <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
