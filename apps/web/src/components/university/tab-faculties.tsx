"use client";

import {
  ArrowUpRight,
  BadgePercent,
  Banknote,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Lock,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { EmptySection } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";
import { FIELDS_OF_STUDY } from "@/lib/fields";
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
 * render at a time, as a master-detail explorer (a program list beside a
 * detail panel that updates on click) instead of a plain divided list or a
 * grid of cards, so browsing a program's full picture — tuition, fees,
 * minimum grade, perks — doesn't mean leaving the tab at all.
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
          <ProgramExplorer
            key={active.id}
            programs={active.programs}
            universitySlug={university.slug}
            locale={locale}
            t={t}
            tCatalog={tCatalog}
          />
        ) : (
          <div className="relative">
            <div aria-hidden className="pointer-events-none select-none blur-sm">
              <ProgramExplorer
                key={active.id}
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

/**
 * List of programs on one side, the selected one's full detail on the
 * other — updates in place on click instead of the browser navigating away,
 * so comparing a few programs back to back doesn't mean bouncing between
 * pages. `key={active.id}` on the caller remounts this fresh (and resets
 * the selection) whenever the faculty tab changes.
 */
function ProgramExplorer({
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
  const [selectedId, setSelectedId] = useState(programs[0]?.id);
  const selected =
    programs.find((program) => program.id === selectedId) ?? programs[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[19rem_1fr] lg:items-start lg:gap-6">
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-20 lg:block lg:max-h-[32rem] lg:space-y-1.5 lg:overflow-y-auto lg:overflow-x-visible lg:pb-0 lg:pe-1">
        {programs.map((program) => {
          const isActive = program.id === selected.id;
          const tuition = formatMoney(locale, program.tuitionFee, program.currency);
          return (
            <li key={program.id} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => setSelectedId(program.id)}
                aria-current={isActive}
                className={cn(
                  "flex min-h-14 w-56 items-center gap-3 rounded-xl border px-3 py-2.5 text-start transition-colors lg:w-full",
                  isActive
                    ? "border-[#1E6DEB] bg-[#EEF3FF] shadow-sm"
                    : "border-slate-200 bg-white hover:border-[#1E6DEB]/40 hover:bg-[#F7F9FE]",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    isActive
                      ? "bg-[#1E6DEB] text-white"
                      : "bg-[#EEF3FF] text-[#1E6DEB]",
                  )}
                >
                  <GraduationCap className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#1F2A44]">
                    {program.name}
                  </span>
                  <span className="block truncate text-xs text-[#5a6072]">
                    {tuition ?? tCatalog(`levels.${program.studyLevel}`)}
                  </span>
                </span>
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 text-[#1E6DEB] transition-opacity rtl:rotate-180",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>

      <ProgramDetail
        program={selected}
        universitySlug={universitySlug}
        locale={locale}
        t={t}
        tCatalog={tCatalog}
      />
    </div>
  );
}

function ProgramDetail({
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
  const applicationFee = formatMoney(locale, program.applicationFee, program.currency);
  const field = FIELDS_OF_STUDY.find((entry) => entry.value === program.fieldOfStudy);
  const fieldLabel = field
    ? locale.startsWith("ar")
      ? field.ar
      : field.en
    : program.fieldOfStudy;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#1E6DEB]">
            <GraduationCap className="size-6" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-bold leading-snug text-[#1F2A44] md:text-xl">
              {program.name}
            </h3>
            <p className="mt-1 text-sm text-[#5a6072]">
              {fieldLabel} · {tCatalog(`levels.${program.studyLevel}`)}
              {years
                ? ` · ${tCatalog("durationYears", {
                    count: years,
                    value: formatNumber(locale, years),
                  })}`
                : null}
            </p>
          </div>
        </div>

        {program.tags.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {program.tags.map((tag) => {
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

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
        <div className="rounded-xl bg-[#F7F9FE] p-3">
          <dt className="text-xs font-semibold text-[#5a6072]">
            {t("tuition.fee")}
          </dt>
          <dd className="mt-1 text-base font-bold text-[#1F2A44]">
            {tuition ?? "—"}
            {tuition ? (
              <span className="ms-1 text-xs font-normal text-[#5a6072]">
                {tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}
              </span>
            ) : null}
          </dd>
        </div>

        <div className="rounded-xl bg-[#F7F9FE] p-3">
          <dt className="text-xs font-semibold text-[#5a6072]">
            {t("tuition.applicationFee")}
          </dt>
          <dd className="mt-1 text-base font-bold text-[#1F2A44]">
            {program.applicationFeeWaived ? (
              <span className="inline-flex items-center gap-1 text-[#1F7A4D]">
                <CheckCircle2 className="size-4" aria-hidden />
                {t("tuition.waived")}
              </span>
            ) : (
              applicationFee ?? "—"
            )}
          </dd>
        </div>

        {program.minGradePercent != null ? (
          <div className="rounded-xl bg-[#F7F9FE] p-3">
            <dt className="flex items-center gap-1 text-xs font-semibold text-[#5a6072]">
              <Target className="size-3.5" aria-hidden />
              {t("scores.minimum")}
            </dt>
            <dd className="mt-1 text-base font-bold text-[#1F2A44]">
              {formatNumber(locale, program.minGradePercent)}
              {tCatalog("units.PERCENT")}
            </dd>
          </div>
        ) : null}
      </dl>

      <Link
        href={`/universities/${universitySlug}/programs/${program.slug}`}
        className="group mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#1E6DEB] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1859c4]"
      >
        {t("viewProgram")}
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          aria-hidden
        />
      </Link>
    </div>
  );
}
