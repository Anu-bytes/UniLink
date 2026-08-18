import { ArrowUpRight, ChevronDown, GraduationCap, Lock } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { EmptySection } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";

/**
 * Faculty names, descriptions and program counts stay public (they're what
 * the directory and search results already show); the actual program list
 * inside each faculty needs an account, same as admission requirements,
 * criteria, scores and tuition elsewhere on this page. Unlike those tabs
 * this isn't gated with the full-page GatedContent overlay (see
 * page.tsx), each faculty section gets its own compact blur, since a
 * university can list many faculties and one giant lock card per section
 * would dominate the page.
 *
 * Each faculty is a native <details> disclosure, collapsed by default: a
 * university with a dozen faculties was rendering every one of their
 * program lists expanded at once, making the tab enormous even before
 * accounting for the gating overlay. No JS needed for the collapse itself,
 * it's plain HTML/CSS.
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

  if (university.faculties.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  return (
    <div className="space-y-4">
      {university.faculties.map((faculty) => (
        <details
          key={faculty.id}
          className="group overflow-hidden rounded-2xl border border-slate-200"
        >
          <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 bg-[#F7F9FE] px-5 py-4 transition-colors hover:bg-[#EEF3FF] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB] group-open:border-b group-open:border-slate-100 md:px-6">
            <h2 className="text-lg font-bold text-[#1F2A44] md:text-xl">
              {faculty.name}
            </h2>
            <div className="flex shrink-0 items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1E6DEB]">
                <GraduationCap className="size-4" aria-hidden />
                {t("facultyProgramCount", { count: faculty.programs.length })}
              </span>
              <ChevronDown
                className="size-5 shrink-0 text-[#5a6072] transition-transform duration-300 group-open:rotate-180"
                aria-hidden
              />
            </div>
          </summary>

          {faculty.description ? (
            <p className="border-b border-slate-100 px-5 py-3 text-sm leading-7 text-[#5a6072] md:px-6">
              {faculty.description}
            </p>
          ) : null}

          {faculty.programs.length > 0 ? (
            isAuthenticated ? (
              <ul className="divide-y divide-slate-100">
                {faculty.programs.map((program) => (
                  <ProgramRow
                    key={program.id}
                    program={program}
                    universitySlug={university.slug}
                    locale={locale}
                    tCatalog={tCatalog}
                  />
                ))}
              </ul>
            ) : (
              <div className="relative">
                <ul
                  aria-hidden
                  className="pointer-events-none select-none divide-y divide-slate-100 blur-sm"
                >
                  {faculty.programs.map((program) => (
                    <ProgramRow
                      key={program.id}
                      program={program}
                      universitySlug={university.slug}
                      locale={locale}
                      tCatalog={tCatalog}
                    />
                  ))}
                </ul>
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 p-4">
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1E6DEB] shadow-sm transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                  >
                    <Lock className="size-4 shrink-0" aria-hidden />
                    {t("programsLocked")}
                  </Link>
                </div>
              </div>
            )
          ) : (
            <p className="px-5 py-6 text-sm text-[#5a6072] md:px-6">
              {t("emptySection")}
            </p>
          )}
        </details>
      ))}
    </div>
  );
}

function ProgramRow({
  program,
  universitySlug,
  locale,
  tCatalog,
}: {
  program: UniversityDetailData["faculties"][number]["programs"][number];
  universitySlug: string;
  locale: string;
  tCatalog: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const years = yearsFromMonths(program.durationMonths);
  const tuition = formatMoney(locale, program.tuitionFee, program.currency);

  return (
    <li>
      <Link
        href={`/universities/${universitySlug}/programs/${program.slug}`}
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB] md:px-6"
      >
        <div className="min-w-0">
          <p className="font-semibold text-[#1F2A44]">{program.name}</p>
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
        <div className="flex items-center gap-3">
          {tuition ? (
            <span className="text-sm font-bold text-[#1F2A44]">
              {tuition}
              <span className="font-normal text-[#5a6072]">
                {tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}
              </span>
            </span>
          ) : null}
          <ArrowUpRight className="size-4 text-[#1E6DEB]" aria-hidden />
        </div>
      </Link>
    </li>
  );
}
