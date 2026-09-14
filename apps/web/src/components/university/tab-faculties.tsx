import {
  BadgePercent,
  Banknote,
  BookOpen,
  Building2,
  GraduationCap,
  Lock,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { EmptySection } from "@/components/university/prose";
import { FacultyAccordion } from "@/components/university/faculty-accordion";
import { ProgramGridReveal } from "@/components/university/program-grid-reveal";
import { Reveal } from "@/components/reveal";
import type { UniversityDetailData } from "@/lib/catalog";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";
import { cn } from "@/lib/utils";

type T = Awaited<ReturnType<typeof getTranslations>>;
type Program = UniversityDetailData["faculties"][number]["programs"][number];

// A visible cap keeps a faculty with a long catalogue from turning the tab
// into an endless scroll; ProgramGridReveal's "Show more" reveals the rest
// in place instead of paginating to another view.
const VISIBLE_PER_FACULTY = 6;

const TAG_STYLES: Record<string, { icon: LucideIcon; badge: string }> = {
  WAIVED_APPLICATION_FEE: { icon: Banknote, badge: "bg-[#E8F9EE] text-[#1F7A4D]" },
  SCHOLARSHIPS_AVAILABLE: { icon: BadgePercent, badge: "bg-[#F3E8FF] text-[#7C3AED]" },
  FAST_ACCEPTANCE: { icon: Zap, badge: "bg-[#FFF6E5] text-[#B77714]" },
  HIGH_JOB_DEMAND: { icon: GraduationCap, badge: "bg-[#EEF3FF] text-[#1E6DEB]" },
  FINANCIAL_AID_AVAILABLE: { icon: Banknote, badge: "bg-[#E8F9EE] text-[#1F7A4D]" },
  CREDIT_HOURS: { icon: GraduationCap, badge: "bg-[#FFF0EE] text-[#C81F15]" },
};

// Cycled per card (not per tag) so a faculty's grid reads as a lively set of
// programs rather than a wall of identical blue icon chips.
const ICON_ACCENTS = [
  "bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7]",
  "bg-gradient-to-br from-[#F82C1F] to-[#ff6b5b]",
  "bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]",
  "bg-gradient-to-br from-[#0EA5A4] to-[#5EEAD4]",
  "bg-gradient-to-br from-[#D97706] to-[#FCD34D]",
];

/**
 * Faculty names, descriptions and program counts stay public (they're what
 * the directory and search results already show); the actual program list
 * needs an account, same as admission requirements, criteria, scores and
 * tuition elsewhere on this page.
 *
 * No top-level tab switcher and no click-to-reveal detail panel — those read
 * as complicated for a student/parent audience. Instead, faculties are a
 * single-open accordion (FacultyAccordion): opening one closes whichever was
 * open, so only one faculty's programs are ever on screen at a time and the
 * page never turns into a long scroll. Every program is a complete card the
 * moment its faculty opens — tuition, application fee, minimum grade, field,
 * perks — with nothing gated behind a further click, and a faculty with a
 * long catalogue caps what's shown up front (ProgramGridReveal's
 * "Show more") so even one open faculty can't get too tall on its own.
 */
export async function TabFaculties({
  university,
  isAuthenticated,
  callbackUrl,
}: {
  university: UniversityDetailData;
  isAuthenticated: boolean;
  callbackUrl: string;
}) {
  const t = await getTranslations("UniversityDetail");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  const faculties = university.faculties.filter(
    (faculty) => faculty.programs.length > 0,
  );

  if (faculties.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  const items = faculties.map((faculty, facultyIndex) => ({
    id: faculty.id,
    header: (
      <Reveal
        delay={facultyIndex * 80}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
            ICON_ACCENTS[facultyIndex % ICON_ACCENTS.length],
          )}
        >
          <Building2 className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-[#1F2A44] md:text-lg">
            {faculty.name}
          </h2>
          {faculty.description ? (
            <p className="mt-0.5 truncate text-xs text-[#5a6072] md:text-sm">
              {faculty.description}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-[#EEF3FF] px-2.5 py-1 text-xs font-bold text-[#1E6DEB]">
          {formatNumber(locale, faculty.programs.length)}
        </span>
      </Reveal>
    ),
    body: (
      <div>
        {/* A grid of cards reads as "info about this faculty" unless it's
            named — spelling out that these are the actual programs/majors
            offered, not just facts about the faculty itself, since that
            isn't obvious to a student or parent browsing this for the
            first time. */}
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#98A0B4]">
          <BookOpen className="size-3.5 text-[#1E6DEB]" aria-hidden />
          {t("programsAndMajors")}
        </p>
        <ProgramGridReveal
          limit={VISIBLE_PER_FACULTY}
          moreLabel={t("showMorePrograms", {
            count: faculty.programs.length - VISIBLE_PER_FACULTY,
          })}
          lessLabel={t("showLessPrograms")}
          items={faculty.programs.map((program, programIndex) => (
            <ProgramCard
              key={program.id}
              program={program}
              universitySlug={university.slug}
              locale={locale}
              t={t}
              tCatalog={tCatalog}
              accent={ICON_ACCENTS[programIndex % ICON_ACCENTS.length]}
            />
          ))}
        />
      </div>
    ),
  }));

  const content = (
    <FacultyAccordion items={items} defaultOpenId={faculties[0]?.id} />
  );

  if (isAuthenticated) {
    return content;
  }

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none blur-sm">
        {content}
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
  );
}

function ProgramCard({
  program,
  universitySlug,
  locale,
  t,
  tCatalog,
  accent,
}: {
  program: Program;
  universitySlug: string;
  locale: string;
  t: T;
  tCatalog: T;
  accent: string;
}) {
  const years = yearsFromMonths(program.durationMonths);
  const tuition = formatMoney(locale, program.tuitionFee, program.currency);
  const field = FIELDS_OF_STUDY.find((entry) => entry.value === program.fieldOfStudy);
  const fieldLabel = field
    ? locale.startsWith("ar")
      ? field.ar
      : field.en
    : program.fieldOfStudy;

  return (
    <Link
      href={`/universities/${universitySlug}/programs/${program.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/30 hover:shadow-[0_20px_45px_-20px_rgba(30,109,235,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
              accent,
            )}
          >
            <GraduationCap className="size-5" aria-hidden />
          </span>
          {program.tags.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-1.5">
              {program.tags.slice(0, 2).map((tag) => {
                const style = TAG_STYLES[tag];
                const TagIcon = style?.icon;
                return (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold leading-none",
                      style?.badge ?? "bg-slate-100 text-[#5a6072]",
                    )}
                  >
                    {TagIcon ? <TagIcon className="size-3" aria-hidden /> : null}
                    {tCatalog(`tags.${tag}`)}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug text-[#1F2A44] transition-colors group-hover:text-[#1E6DEB]">
          {program.name}
        </h3>
        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#1E6DEB]">
          {fieldLabel}
        </p>
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

      {/* Tuition is what actually drives a family's decision, so it's the
          one number that gets real visual weight; minimum grade is useful
          context but secondary, so it's a small badge rather than an equal
          stat — clearer at a glance than a grid of same-size figures. */}
      <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs font-semibold text-[#98A0B4]">
            {t("tuition.fee")}
          </p>
          <p className="mt-0.5 text-lg font-bold leading-none text-[#1F2A44]">
            {tuition ?? "—"}
          </p>
          {tuition ? (
            <p className="mt-1 text-xs text-[#5a6072]">
              {tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}
            </p>
          ) : null}
        </div>

        {program.minGradePercent != null ? (
          <div className="shrink-0 rounded-xl bg-[#F7F9FE] px-3 py-2 text-end">
            <p className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#98A0B4]">
              <Target className="size-3" aria-hidden />
              {t("scores.minimum")}
            </p>
            <p className="mt-0.5 text-sm font-bold text-[#1F2A44]">
              {formatNumber(locale, program.minGradePercent)}
              {tCatalog("units.PERCENT")}
            </p>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
