import {
  BadgePercent,
  BadgeCheck,
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  Code2,
  FlaskConical,
  GraduationCap,
  Landmark,
  Languages,
  Layers,
  Lock,
  Percent,
  Megaphone,
  Palette,
  Scale,
  Settings,
  Stethoscope,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { EmptySection, Paragraphs } from "@/components/university/prose";
import { FacultyGrid } from "@/components/university/faculty-grid";
import { ProgramCompareButton } from "@/components/university/program-compare-button";
import { ProgramDialog } from "@/components/university/program-dialog";
import { UniversityLogo } from "@/components/university-logo";
import { ProgramGridReveal } from "@/components/university/program-grid-reveal";
import { Reveal } from "@/components/reveal";
import type { UniversityDetailData } from "@/lib/catalog";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatDate, formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";
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

const TILE_COLORS = {
  blue: "bg-[#EEF3FF] text-[#1E6DEB]",
  green: "bg-[#E8F9EE] text-[#1F7A4D]",
  pink: "bg-[#FFE8F3] text-[#D6317F]",
  purple: "bg-[#F3E8FF] text-[#7C3AED]",
  orange: "bg-[#FFF3E0] text-[#D97706]",
  teal: "bg-[#E0F7F5] text-[#0E9F9A]",
  red: "bg-[#FFF0EE] text-[#F82C1F]",
};

// Faculties carry no icon of their own, so one is picked from the name
// (English or Arabic). Order matters: the first match wins.
const FACULTY_STYLES: { test: RegExp; icon: LucideIcon; color: string }[] = [
  { test: /comput|informatic|software|\bIT\b|data|حاسب|معلومات|برمج/i, icon: Code2, color: TILE_COLORS.blue },
  { test: /engineer|هندس/i, icon: Settings, color: TILE_COLORS.blue },
  { test: /medic|pharm|dent|nurs|health|vet|طب|صيدل|أسنان|اسنان|تمريض|صح/i, icon: Stethoscope, color: TILE_COLORS.red },
  { test: /business|manage|econom|commerce|financ|account|إدارة|ادارة|أعمال|اعمال|اقتصاد|تجارة|محاسب/i, icon: TrendingUp, color: TILE_COLORS.green },
  { test: /communic|media|mass|journal|إعلام|اعلام|اتصال/i, icon: Megaphone, color: TILE_COLORS.pink },
  { test: /art|design|architect|فنون|تصميم|عمارة|هندسة معمارية/i, icon: Palette, color: TILE_COLORS.purple },
  { test: /law|legal|حقوق|قانون/i, icon: Scale, color: TILE_COLORS.teal },
  { test: /human|literat|language|educat|آداب|اداب|لغات|إنسان|انسان|تربية/i, icon: BookOpen, color: TILE_COLORS.orange },
  { test: /scien|علوم/i, icon: FlaskConical, color: TILE_COLORS.teal },
];

const FALLBACK_STYLES = [
  { icon: Landmark, color: TILE_COLORS.blue },
  { icon: Building2, color: TILE_COLORS.red },
];

function facultyStyle(name: string, index: number) {
  return (
    FACULTY_STYLES.find((style) => style.test.test(name)) ??
    FALLBACK_STYLES[index % FALLBACK_STYLES.length]
  );
}

/**
 * Faculty names and program counts stay public (they're what the directory
 * and search results already show); the actual program list needs an
 * account, same as admission requirements, scores and tuition elsewhere on
 * this page.
 *
 * Faculties are a compact searchable grid of tiles (FacultyGrid). Opening a
 * tile expands it in place and closes the previous one, so only one
 * faculty's programs are on screen at a time. Every program is a complete
 * card the moment its faculty opens, and a long catalogue caps what's shown
 * up front (ProgramGridReveal's "Show more").
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
  const tProgram = await getTranslations("ProgramDetail");
  const locale = await getLocale();

  const faculties = university.faculties.filter(
    (faculty) => faculty.programs.length > 0,
  );

  if (faculties.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  const locked = !isAuthenticated;
  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  // Signed-out visitors get faculty names only. Program names, counts and
  // details are swapped for placeholders here on the server, so the real
  // values never reach the browser (a CSS blur alone would leave them in the
  // page source).
  const items = faculties.map((faculty, facultyIndex) => {
    const { icon: FacultyIcon, color } = facultyStyle(faculty.name, facultyIndex);
    return {
    id: faculty.id,
    name: faculty.name,
    countLabel: locked
      ? ""
      : t("facultyProgramCount", { count: faculty.programs.length }),
    // Program names double as the keyword line under the faculty name, so a
    // tile says what it contains without opening it.
    summary: locked
      ? ""
      : faculty.programs
          .slice(0, 3)
          .map((program) => program.name)
          .join(" • "),
    icon: (
      <Reveal
        key={faculty.id}
        delay={facultyIndex * 60}
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12",
          color,
        )}
      >
        <FacultyIcon className="size-6" aria-hidden />
      </Reveal>
    ),
    body: locked ? (
      <LockedPrograms key={faculty.id} href={loginHref} label={t("programsLocked")} />
    ) : (
      <div key={faculty.id}>
        {/* Spell out that these cards are the programs/majors offered inside
            this faculty, which isn't obvious to a first-time visitor. */}
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
              university={university}
              facultyName={faculty.name}
              locale={locale}
              t={t}
              tProgram={tProgram}
              tCatalog={tCatalog}
              accent={ICON_ACCENTS[programIndex % ICON_ACCENTS.length]}
            />
          ))}
        />
      </div>
    ),
    };
  });

  return (
    <FacultyGrid
      items={items}
      heading={t("facultiesHeading")}
      subtitle={t("facultiesSubtitle")}
      countBadge={t("facultiesCountBadge", { count: faculties.length })}
      searchPlaceholder={t("searchFaculties")}
      emptyLabel={t("noFacultyMatch")}
      locked={locked}
      banner={
        locked ? (
          <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#1E6DEB]/20 bg-[#F5F8FF] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1E6DEB] text-white">
                <Lock className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-base font-bold text-[#1F2A44]">
                  {t("lockedTitle")}
                </p>
                <p className="mt-0.5 text-sm text-[#5a6072]">{t("lockedBody")}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={loginHref}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#1E6DEB] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1859c4] sm:flex-none"
              >
                {t("logIn")}
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#1E6DEB] bg-white px-5 text-sm font-bold text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF] sm:flex-none"
              >
                {t("registerFree")}
              </Link>
            </div>
          </div>
        ) : null
      }
    />
  );
}

/** Blurred stand-in for a faculty's programs, with a sign-in prompt on top. */
function LockedPrograms({ href, label }: { href: string; label: string }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none grid select-none gap-3 blur-[5px] sm:grid-cols-2 lg:grid-cols-3"
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="size-11 rounded-xl bg-slate-200" />
            <div className="h-4 w-3/4 rounded-full bg-slate-200" />
            <div className="h-3 w-1/2 rounded-full bg-slate-100" />
            <div className="h-6 w-1/3 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Link
          href={href}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-[#1E6DEB] shadow-md transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          <Lock className="size-4 shrink-0" aria-hidden />
          {label}
        </Link>
      </div>
    </div>
  );
}

function ProgramCard({
  program,
  university,
  facultyName,
  locale,
  t,
  tProgram,
  tCatalog,
  accent,
}: {
  program: Program;
  university: UniversityDetailData;
  facultyName: string;
  locale: string;
  t: T;
  tProgram: T;
  tCatalog: T;
  accent: string;
}) {
  return (
    <ProgramDialog
      closeLabel={tProgram("close")}
      card={
        <ProgramCardFace
          program={program}
          locale={locale}
          t={t}
          tCatalog={tCatalog}
          accent={accent}
        />
      }
      detail={
        <ProgramDetail
          program={program}
          university={university}
          facultyName={facultyName}
          locale={locale}
          t={tProgram}
          tCatalog={tCatalog}
        />
      }
    />
  );
}

function ProgramDetail({
  program,
  university,
  facultyName,
  locale,
  t,
  tCatalog,
}: {
  program: Program;
  university: UniversityDetailData;
  facultyName: string;
  locale: string;
  t: T;
  tCatalog: T;
}) {
  const years = yearsFromMonths(program.durationMonths);
  const duration =
    program.durationLabel ??
    (years
      ? tCatalog("durationYears", {
          count: years,
          value: formatNumber(locale, years),
        })
      : program.durationMonths
        ? tCatalog("durationMonths", { count: program.durationMonths })
        : null);
  const tuition = formatMoney(locale, program.tuitionFee, program.currency);

  const facts = [
    { icon: GraduationCap, label: t("level"), value: tCatalog(`levels.${program.studyLevel}`) },
    { icon: Layers, label: t("faculty"), value: facultyName },
    duration ? { icon: Clock, label: t("duration"), value: duration } : null,
    {
      icon: Banknote,
      label: t("tuition"),
      value: tuition
        ? `${tuition}${tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}`
        : t("notSpecified"),
    },
    {
      icon: BadgeCheck,
      label: t("applicationFee"),
      value: program.applicationFeeWaived
        ? t("waived")
        : (formatMoney(locale, program.applicationFee, program.currency) ??
          t("notSpecified")),
    },
    program.minGradePercent != null
      ? {
          icon: Percent,
          label: t("minimumGrade"),
          value: `${formatNumber(locale, program.minGradePercent)}${tCatalog("units.PERCENT")}`,
        }
      : null,
  ].filter((fact): fact is NonNullable<typeof fact> => fact != null);

  return (
    <div>
      <header className="flex items-start gap-4">
        <UniversityLogo
          name={university.name}
          logoUrl={university.logoUrl}
          className="size-12"
        />
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
            {program.name}
          </h2>
          <p className="mt-1 text-sm text-[#5a6072]">
            {university.name} · {university.city}
          </p>
        </div>
      </header>

      {program.tags.length > 0 || program.coopAvailable ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {program.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-semibold text-[#1E3A8A]"
            >
              {tCatalog(`tags.${tag}`)}
            </li>
          ))}
          {program.coopAvailable ? (
            <li className="rounded-full bg-[#E9F7F0] px-3 py-1 text-xs font-semibold text-[#1F7A4D]">
              {t("coopAvailable")}
            </li>
          ) : null}
        </ul>
      ) : null}

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <dt className="flex items-center gap-2 text-xs font-semibold text-[#5a6072]">
              <fact.icon className="size-4 text-[#1E6DEB]" aria-hidden />
              {fact.label}
            </dt>
            <dd className="mt-1.5 text-base font-bold text-[#1F2A44]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      {program.description ? (
        <section className="mt-6">
          <h3 className="text-lg font-bold text-[#1F2A44]">
            {t("aboutProgram")}
          </h3>
          <div className="mt-2">
            <Paragraphs text={program.description} />
          </div>
        </section>
      ) : null}

      {program.englishRequirements.length > 0 ? (
        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#1F2A44]">
            <Languages className="size-5 text-[#1E6DEB]" aria-hidden />
            {t("englishRequirements")}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {program.englishRequirements.map((requirement) => (
              <li
                key={requirement.id}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              >
                <span className="font-semibold text-[#1F2A44]">
                  {tCatalog(`englishTests.${requirement.test}`)}
                </span>
                <span className="ms-2 text-[#5a6072]">
                  {formatNumber(locale, requirement.minScore)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {program.intakes.length > 0 ? (
        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#1F2A44]">
            <CalendarDays className="size-5 text-[#1E6DEB]" aria-hidden />
            {t("intakes")}
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {program.intakes.map((intake) => (
              <li
                key={intake.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-[#1F2A44]">
                  {tCatalog(`seasons.${intake.season}`)}{" "}
                  {formatNumber(locale, intake.year)}
                </p>
                <p className="mt-1 text-sm text-[#5a6072]">
                  {intake.applicationDeadline
                    ? t("deadline", {
                        date: formatDate(locale, intake.applicationDeadline),
                      })
                    : t("noDeadline")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {/* Disabled until applications leave preview. */}
        <button
          type="button"
          disabled
          className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 text-base font-bold text-[#98A0B4]"
        >
          {t("startApplication")}
          <span className="rounded-full bg-[#FFF6E5] px-2 py-0.5 text-[11px] font-bold text-[#B77714]">
            {t("comingSoon")}
          </span>
        </button>
        <ProgramCompareButton
          id={program.id}
          name={program.name}
          universityName={university.name}
          logoUrl={university.logoUrl}
        />
      </div>
    </div>
  );
}

function ProgramCardFace({
  program,
  locale,
  t,
  tCatalog,
  accent,
}: {
  program: Program;
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
    <div
      className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/30 hover:shadow-[0_20px_45px_-20px_rgba(30,109,235,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
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
    </div>
  );
}
