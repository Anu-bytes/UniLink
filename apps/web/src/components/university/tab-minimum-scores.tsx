import { Info, Target } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { EmptySection } from "@/components/university/prose";
import {
  ADMISSION_CATEGORIES,
  ADMISSION_LIMITS_YEAR,
  CERTIFICATE_GROUPS,
  limitsForCategory,
  publishedCategoriesFor,
  type AdmissionCategory,
  type Branch,
  type CertificateGroup,
} from "@/lib/admission-limits";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const BRANCHES: readonly Branch[] = ["ARISH", "QANTARA"];
const MAX_FACULTY_CHIPS = 3;

/**
 * The "Minimum Scores" tab: the published 2026/2027 limits that apply at
 * this university, one row per group of faculties it actually has, with
 * both certificate tables side by side (and per campus where a university
 * publishes campus limits).
 */
export async function TabMinimumScores({
  university,
  highlight = null,
}: {
  university: UniversityDetailData;
  /** The signed-in student's certificate group, to highlight their column. */
  highlight?: CertificateGroup | null;
}) {
  const t = await getTranslations("Admission");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  // Group the university's programs by published category, remembering which
  // faculties fall in each, and collect what the table doesn't cover.
  const categories = new Map<AdmissionCategory, Set<string>>();
  const ownMinimums: { name: string; faculty: string; value: number }[] = [];
  const uncovered = new Set<string>();
  let hasBranches = false;

  for (const faculty of university.faculties) {
    for (const program of faculty.programs) {
      if (program.admissionLimit) {
        const names = categories.get(program.admissionLimit.category) ?? new Set<string>();
        names.add(faculty.name);
        categories.set(program.admissionLimit.category, names);
        if (program.admissionLimit.branch) hasBranches = true;
      } else if (program.minGradePercent != null) {
        ownMinimums.push({ name: program.name, faculty: faculty.name, value: program.minGradePercent });
      } else {
        uncovered.add(faculty.name);
      }
    }
  }
  // A faculty partly covered (one program mapped, one not) is not "missing".
  for (const names of categories.values()) for (const name of names) uncovered.delete(name);

  // A covered university whose programs aren't in the catalogue yet still has
  // known minimums: show its whole published table instead of nothing.
  const fullTable = categories.size === 0 && university.programCount === 0;
  const rows = fullTable
    ? publishedCategoriesFor(university)
    : ADMISSION_CATEGORIES.filter((category) => categories.has(category));

  if (rows.length === 0 && ownMinimums.length === 0 && university.minimumScores.length === 0) {
    return <EmptySection message={t("empty")} />;
  }

  const percent = (value: number | null) =>
    value == null ? null : `${formatNumber(locale, value)}%`;

  return (
    <div>
      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#1F2A44] md:text-2xl">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#1E6DEB] text-white shadow-sm">
              <Target className="size-5" aria-hidden />
            </span>
            {t("heading")}
          </h2>
          <span className="rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-semibold text-[#1E3A8A]">
            {t("year", { year: ADMISSION_LIMITS_YEAR })}
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5a6072] md:text-base">
          {t("intro")}
        </p>

        {/* Legend: the short column labels used in every row, spelled out. */}
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {CERTIFICATE_GROUPS.map((group) => (
            <li
              key={group}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3.5 py-2.5",
                highlight === group
                  ? "border-[#1E6DEB] bg-[#F3F7FF]"
                  : "border-slate-200 bg-white",
              )}
            >
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-xs font-bold",
                  group === "EGYPTIAN" ? "bg-[#1E6DEB] text-white" : "bg-[#0F9F8F] text-white",
                )}
              >
                {t(`groupsShort.${group}`)}
              </span>
              <span className="min-w-0 text-sm font-semibold text-[#1F2A44]">
                {t(`groups.${group}`)}
              </span>
              {highlight === group ? (
                <span className="ms-auto shrink-0 rounded-full bg-[#1E6DEB] px-2 py-0.5 text-[10px] font-bold text-white">
                  {t("yourCertificate")}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </header>

      {fullTable && rows.length > 0 ? (
        <p className="mt-5 text-sm text-[#5a6072]">{t("fullTableNote")}</p>
      ) : null}

      {rows.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {rows.map((category) => {
            const faculties = [...(categories.get(category) ?? [])];
            const shown = faculties.slice(0, MAX_FACULTY_CHIPS);
            const note = t.has(`categoryNotes.${category}`)
              ? t(`categoryNotes.${category}`)
              : null;
            return (
              <li
                key={category}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-center md:p-5"
              >
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#1F2A44] md:text-lg">
                    {t(`categories.${category}`)}
                  </h3>
                  {note ? (
                    <p className="mt-1 text-xs leading-5 text-[#5a6072]">{note}</p>
                  ) : null}
                  {faculties.length > 0 ? (
                    <p className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#98A0B4]">
                        {t("facultiesHere")}
                      </span>
                      {shown.map((name) => (
                        <span
                          key={name}
                          className="rounded-full bg-[#F1F4FA] px-2.5 py-0.5 text-xs font-medium text-[#3F4657]"
                        >
                          {name}
                        </span>
                      ))}
                      {faculties.length > shown.length ? (
                        <span className="text-xs font-semibold text-[#5a6072]">
                          +{formatNumber(locale, faculties.length - shown.length)}
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {CERTIFICATE_GROUPS.map((group) => {
                    const mine = highlight === group;
                    return (
                      <div
                        key={group}
                        className={cn(
                          "rounded-xl px-3 py-2.5",
                          mine ? "bg-[#EEF4FF] ring-2 ring-[#1E6DEB]/30" : "bg-[#F7F9FE]",
                        )}
                      >
                        <p
                          className={cn(
                            "text-[11px] font-bold",
                            group === "EGYPTIAN" ? "text-[#1E6DEB]" : "text-[#0F8A7C]",
                          )}
                        >
                          {t(`groupsShort.${group}`)}
                        </p>
                        {hasBranches ? (
                          <dl className="mt-1 space-y-1">
                            {BRANCHES.map((branch) => {
                              const value = percent(
                                limitsForCategory(university, category, branch)[group],
                              );
                              return (
                                <div key={branch} className="flex items-baseline justify-between gap-2">
                                  <dt className="truncate text-xs text-[#5a6072]">
                                    {t(`branches.${branch}`)}
                                  </dt>
                                  <dd
                                    className={cn(
                                      "shrink-0 text-base font-extrabold",
                                      value ? "text-[#1F2A44]" : "text-xs font-semibold text-[#98A0B4]",
                                    )}
                                    dir="ltr"
                                  >
                                    {value ?? t("notOffered")}
                                  </dd>
                                </div>
                              );
                            })}
                          </dl>
                        ) : (
                          <p className="mt-0.5 text-2xl font-extrabold leading-tight text-[#1F2A44]" dir="ltr">
                            {percent(limitsForCategory(university, category)[group]) ?? "—"}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {ownMinimums.length > 0 ? (
        <section className="mt-8">
          <h3 className="text-base font-bold text-[#1F2A44] md:text-lg">{t("programMinimums")}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {ownMinimums.map((entry) => (
              <li
                key={`${entry.faculty}-${entry.name}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#1F2A44]">{entry.name}</span>
                  <span className="block truncate text-xs text-[#5a6072]">{entry.faculty}</span>
                </span>
                <span className="shrink-0 text-lg font-extrabold text-[#1E6DEB]" dir="ltr">
                  {percent(entry.value)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {university.minimumScores.length > 0 ? (
        <section className="mt-8">
          <h3 className="text-base font-bold text-[#1F2A44] md:text-lg">{t("universityScores")}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {university.minimumScores.map((score) => (
              <li
                key={score.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#1F2A44]">
                    {tCatalog(`systems.${score.system}`)}
                  </span>
                  {score.facultyName ? (
                    <span className="block truncate text-xs text-[#5a6072]">{score.facultyName}</span>
                  ) : null}
                </span>
                <span className="shrink-0 text-lg font-extrabold text-[#1E6DEB]">
                  {formatNumber(locale, score.minScore)}
                  <span className="ms-1 text-xs font-semibold text-[#5a6072]">
                    {tCatalog(`units.${score.unit}`)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {uncovered.size > 0 && rows.length > 0 ? (
        <p className="mt-6 text-sm text-[#5a6072]">
          {t("notCovered", { list: [...uncovered].join(locale.startsWith("ar") ? "، " : ", ") })}
        </p>
      ) : null}

      <p className="mt-6 flex gap-2.5 rounded-xl bg-[#FFF8EB] px-4 py-3 text-sm leading-6 text-[#7A5310]">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        {t("disclaimer")}
      </p>
    </div>
  );
}
