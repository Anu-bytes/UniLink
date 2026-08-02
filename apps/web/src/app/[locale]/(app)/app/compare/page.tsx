import { ArrowLeft, ExternalLink, Check, X, ArrowLeftRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import {
  CompareBootstrap,
  CompareDownload,
  CompareRemoveButton,
  CompareSync,
  type CsvTable,
} from "@/components/app/compare-actions";
import { UniversityLogo } from "@/components/university-logo";
import { formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";
import { BAND_STYLES } from "@/lib/matching";
import { getProgramsForCompare, type ProgramResult } from "@/lib/program-search";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ ids?: string }>;
};

type Row = { label: string; values: string[]; highlight?: boolean };
type Group = { title: string; rows: Row[] };

export default async function ComparePage({ searchParams }: PageProps) {
  const t = await getTranslations("Compare");
  const tSearch = await getTranslations("Search");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();
  const session = await auth();

  const { ids: raw } = await searchParams;
  const ids = (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 4);

  const programs = await getProgramsForCompare(
    locale,
    ids,
    session?.user?.id ?? null,
  );

  if (programs.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <CompareBootstrap hasIds={ids.length > 0} />
        <ArrowLeftRight
          className="mx-auto size-10 text-[#98A0B4]"
          aria-hidden
        />
        <h1 className="mt-4 text-2xl font-bold text-[#1F2A44]">
          {t("emptyTitle")}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-base text-[#5a6072]">
          {t("emptyBody")}
        </p>
        <Link
          href="/app/search"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white hover:bg-[#1859c4]"
        >
          {t("backToSearch")}
        </Link>
      </div>
    );
  }

  const value = (program: ProgramResult) => ({
    location: `${program.university.city}, ${program.university.country}`,
    level: tCatalog(`levels.${program.studyLevel}`),
    duration:
      program.durationLabel ??
      (yearsFromMonths(program.durationMonths)
        ? tCatalog("durationYears", {
            count: yearsFromMonths(program.durationMonths)!,
          })
        : t("notSpecified")),
    intake:
      program.intakes.length > 0
        ? program.intakes
            .map(
              (intake) =>
                `${tCatalog(`seasons.${intake.season}`)} ${intake.year}`,
            )
            .join("\n")
        : t("notSpecified"),
    faculty: program.facultyName ?? t("notSpecified"),
    tuition: formatMoney(locale, program.tuitionFee, program.currency)
      ? `${formatMoney(locale, program.tuitionFee, program.currency)}${tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}`
      : t("notSpecified"),
    applicationFee: program.applicationFeeWaived
      ? t("waived")
      : (formatMoney(locale, program.applicationFee, program.currency) ??
        t("notSpecified")),
    coop: program.coopAvailable ? t("yes") : t("no"),
    scholarships: program.tags.includes("SCHOLARSHIPS_AVAILABLE")
      ? t("yes")
      : t("no"),
    creditHours: program.tags.includes("CREDIT_HOURS") ? t("yes") : t("no"),
    minimumGrade:
      program.minGradePercent != null
        ? `${formatNumber(locale, program.minGradePercent)}${tCatalog("units.PERCENT")}`
        : t("notSpecified"),
    english:
      program.englishRequirements.length > 0
        ? program.englishRequirements
            .map(
              (requirement) =>
                `${tCatalog(`englishTests.${requirement.test}`)} ${formatNumber(locale, requirement.minScore)}`,
            )
            .join("\n")
        : t("notSpecified"),
  });

  const values = programs.map(value);
  const column = <K extends keyof ReturnType<typeof value>>(key: K) =>
    values.map((entry) => entry[key]);

  const groups: Group[] = [
    {
      title: t("groups.overview"),
      rows: [
        { label: t("rows.location"), values: column("location") },
        { label: t("rows.level"), values: column("level") },
        { label: t("rows.faculty"), values: column("faculty") },
        { label: t("rows.duration"), values: column("duration") },
        { label: t("rows.intake"), values: column("intake") },
      ],
    },
    {
      title: t("groups.cost"),
      rows: [
        { label: t("rows.tuition"), values: column("tuition"), highlight: true },
        { label: t("rows.applicationFee"), values: column("applicationFee") },
      ],
    },
    {
      title: t("groups.features"),
      rows: [
        { label: t("rows.coop"), values: column("coop") },
        { label: t("rows.scholarships"), values: column("scholarships") },
        { label: t("rows.creditHours"), values: column("creditHours") },
      ],
    },
    {
      title: t("groups.requirements"),
      rows: [
        { label: t("rows.minimumGrade"), values: column("minimumGrade") },
        { label: t("rows.english"), values: column("english") },
      ],
    },
  ];

  const csv: CsvTable = {
    headers: ["", ...programs.map((program) => `${program.name} (${program.university.name})`)],
    rows: groups.flatMap((group) =>
      group.rows.map((row) => [
        row.label,
        ...row.values.map((entry) => entry.replace(/\n/g, " / ")),
      ]),
    ),
  };

  const yesLabel = t("yes");

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 md:px-6 md:py-8">
      <CompareSync
        entries={programs.map((program) => ({
          id: program.id,
          name: program.name,
          universityName: program.university.name,
          logoUrl: program.university.logoUrl,
        }))}
      />

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-11 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#1E6DEB]"
          >
            <ArrowLeftRight className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2A44]">{t("title")}</h1>
            <p className="text-sm text-[#5a6072]">
              {t("subtitle", { count: programs.length })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <Link
            href="/app/search"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-[#1F2A44] hover:bg-slate-50"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t("back")}
          </Link>
          <CompareDownload table={csv} />
        </div>
      </header>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[48rem] border-collapse text-start">
          <caption className="sr-only">{t("title")}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="w-52 border-b border-slate-200 bg-white p-4 text-start align-top"
              >
                <span className="sr-only">{t("title")}</span>
              </th>
              {programs.map((program) => {
                const bandStyle = program.match
                  ? BAND_STYLES[program.match.band]
                  : null;
                return (
                  <th
                    key={program.id}
                    scope="col"
                    className="min-w-64 border-s border-b border-slate-200 bg-white p-4 text-start align-top"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <UniversityLogo
                        name={program.university.name}
                        logoUrl={program.university.logoUrl}
                        className="size-10"
                        textClassName="text-xs"
                      />
                      <CompareRemoveButton
                        id={program.id}
                        name={program.name}
                        remainingIds={programs.map((entry) => entry.id)}
                      />
                    </div>

                    {program.match && bandStyle ? (
                      <span
                        className={cn(
                          "mt-3 flex items-center gap-1.5 text-xs font-semibold",
                          bandStyle.text,
                        )}
                      >
                        <span
                          className={cn("size-1.5 rounded-full", bandStyle.dot)}
                        />
                        {tSearch(`bands.${program.match.band}`)}
                      </span>
                    ) : null}

                    <p className="mt-2 text-sm font-bold text-[#1F2A44]">
                      {program.name}
                    </p>
                    <p className="mt-1 text-xs text-[#5a6072]">
                      {program.university.name}
                    </p>

                    <Link
                      href={`/universities/${program.university.slug}/programs/${program.slug}`}
                      className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#EEF3FF] px-3 text-xs font-bold text-[#1E6DEB] hover:bg-[#dfe9ff] print:hidden"
                    >
                      {t("viewDetails")}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>

          {groups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={programs.length + 1}
                  className="bg-[#F7F9FE] px-4 py-2 text-start text-xs font-bold uppercase tracking-wider text-[#5a6072]"
                >
                  {group.title}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-t border-slate-100">
                  <th
                    scope="row"
                    className="bg-[#FCFDFF] px-4 py-3 text-start text-sm font-semibold text-[#5a6072] align-top"
                  >
                    {row.label}
                  </th>
                  {row.values.map((entry, index) => (
                    <td
                      key={`${row.label}-${programs[index]?.id ?? index}`}
                      className={cn(
                        "border-s border-slate-100 px-4 py-3 align-top text-sm",
                        row.highlight
                          ? "font-bold text-[#1F2A44]"
                          : "text-[#1F2A44]",
                      )}
                    >
                      {entry === yesLabel ? (
                        <span className="inline-flex items-center gap-1.5 text-[#1F7A4D]">
                          <Check className="size-4" aria-hidden />
                          {entry}
                        </span>
                      ) : entry === t("no") ? (
                        <span className="inline-flex items-center gap-1.5 text-[#98A0B4]">
                          <X className="size-4" aria-hidden />
                          {entry}
                        </span>
                      ) : (
                        entry.split("\n").map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
