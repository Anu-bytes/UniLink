import { ArrowUpRight, GraduationCap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { EmptySection } from "@/components/university/prose";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatMoney, yearsFromMonths } from "@/lib/format";

export async function TabFaculties({
  university,
}: {
  university: UniversityDetailData;
}) {
  const t = await getTranslations("UniversityDetail");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  if (university.faculties.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  return (
    <div className="space-y-6">
      {university.faculties.map((faculty) => (
        <section
          key={faculty.id}
          className="overflow-hidden rounded-2xl border border-slate-200"
        >
          <header className="border-b border-slate-100 bg-[#F7F9FE] px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#1F2A44] md:text-xl">
                {faculty.name}
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1E6DEB]">
                <GraduationCap className="size-4" aria-hidden />
                {t("facultyProgramCount", { count: faculty.programs.length })}
              </span>
            </div>
            {faculty.description ? (
              <p className="mt-2 text-sm leading-7 text-[#5a6072]">
                {faculty.description}
              </p>
            ) : null}
          </header>

          {faculty.programs.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {faculty.programs.map((program) => {
                const years = yearsFromMonths(program.durationMonths);
                const tuition = formatMoney(
                  locale,
                  program.tuitionFee,
                  program.currency,
                );

                return (
                  <li key={program.id}>
                    <Link
                      href={`/universities/${university.slug}/programs/${program.slug}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB] md:px-6"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1F2A44]">
                          {program.name}
                        </p>
                        <p className="mt-1 text-sm text-[#5a6072]">
                          {tCatalog(`levels.${program.studyLevel}`)}
                          {years
                            ? ` · ${tCatalog("durationYears", { count: years })}`
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
                        <ArrowUpRight
                          className="size-4 text-[#1E6DEB]"
                          aria-hidden
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-[#5a6072] md:px-6">
              {t("emptySection")}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
