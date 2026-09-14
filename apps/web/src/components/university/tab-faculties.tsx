import {
  BadgePercent,
  Banknote,
  CheckCircle2,
  GraduationCap,
  Lock,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { EmptySection } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";

type T = Awaited<ReturnType<typeof getTranslations>>;
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
 * needs an account, same as admission requirements, criteria, scores and
 * tuition elsewhere on this page.
 *
 * Deliberately no tab switcher and no click-to-reveal panel: both were
 * extra steps between a visitor and the answer they came for, and testing
 * this with a student/parent audience in mind, that indirection read as
 * complicated rather than tidy. Every program's full picture — tuition,
 * application fee, minimum grade, field, perks — is just there on its
 * card, grouped under its faculty's name as a plain heading (not a
 * control), so the page is something to scroll, not operate.
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

  const content = (
    <div className="space-y-10">
      {faculties.map((faculty) => (
        <section key={faculty.id}>
          <h2 className="text-lg font-bold text-[#1F2A44] md:text-xl">
            {faculty.name}
          </h2>
          {faculty.description ? (
            <p className="mt-1.5 text-sm leading-6 text-[#5a6072]">
              {faculty.description}
            </p>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                universitySlug={university.slug}
                locale={locale}
                t={t}
                tCatalog={tCatalog}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
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
    <Link
      href={`/universities/${universitySlug}/programs/${program.slug}`}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
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
          {fieldLabel} · {tCatalog(`levels.${program.studyLevel}`)}
          {years
            ? ` · ${tCatalog("durationYears", {
                count: years,
                value: formatNumber(locale, years),
              })}`
            : null}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div>
          <dt className="text-xs font-semibold text-[#98A0B4]">
            {t("tuition.fee")}
          </dt>
          <dd className="mt-0.5 text-sm font-bold text-[#1F2A44]">
            {tuition ?? "—"}
            {tuition ? (
              <span className="ms-1 text-xs font-normal text-[#5a6072]">
                {tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}
              </span>
            ) : null}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold text-[#98A0B4]">
            {t("tuition.applicationFee")}
          </dt>
          <dd className="mt-0.5 text-sm font-bold text-[#1F2A44]">
            {program.applicationFeeWaived ? (
              <span className="inline-flex items-center gap-1 text-[#1F7A4D]">
                <CheckCircle2 className="size-3.5" aria-hidden />
                {t("tuition.waived")}
              </span>
            ) : (
              applicationFee ?? "—"
            )}
          </dd>
        </div>

        {program.minGradePercent != null ? (
          <div className="col-span-2">
            <dt className="flex items-center gap-1 text-xs font-semibold text-[#98A0B4]">
              <Target className="size-3.5" aria-hidden />
              {t("scores.minimum")}
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-[#1F2A44]">
              {formatNumber(locale, program.minGradePercent)}
              {tCatalog("units.PERCENT")}
            </dd>
          </div>
        ) : null}
      </dl>
    </Link>
  );
}
