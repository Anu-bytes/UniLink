import { ArrowLeft, ExternalLink, Check, X, ArrowLeftRight } from "lucide-react";
import Image from "next/image";
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
import type { CompareEntry } from "@/components/app/compare-context";
import { UniversityLogo } from "@/components/university-logo";
import { getFacultiesForCompare } from "@/lib/faculty-search";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";
import { BAND_STYLES, type MatchBand } from "@/lib/matching";
import { getProgramsForCompare } from "@/lib/program-search";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ ids?: string; kind?: string }>;
};

type Row = { label: string; values: string[]; highlight?: boolean };
type Group = { title: string; rows: Row[] };

/** One column of the table, shared by both faculty and program comparisons. */
type Column = {
  id: string;
  title: string;
  subtitle: string;
  logoName: string;
  logoUrl: string | null;
  band: MatchBand | null;
  detailsHref: string;
};

export default async function ComparePage({ searchParams }: PageProps) {
  const t = await getTranslations("Compare");
  const tSearch = await getTranslations("Search");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();
  const session = await auth();
  const isArabic = locale.startsWith("ar");
  const userId = session?.user?.id ?? null;

  const { ids: raw, kind: rawKind } = await searchParams;
  const kind = rawKind === "faculty" ? "faculty" : "program";
  const ids = (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 4);

  const faculties =
    kind === "faculty" ? await getFacultiesForCompare(locale, ids, userId) : [];
  const programs =
    kind === "program" ? await getProgramsForCompare(locale, ids, userId) : [];

  const columns: Column[] =
    kind === "faculty"
      ? faculties.map((faculty) => ({
          id: faculty.id,
          title: faculty.name,
          subtitle: faculty.university.name,
          logoName: faculty.university.name,
          logoUrl: faculty.university.logoUrl,
          band: faculty.match?.band ?? null,
          detailsHref: `/app/faculties/${faculty.id}`,
        }))
      : programs.map((program) => ({
          id: program.id,
          title: program.name,
          subtitle: program.university.name,
          logoName: program.university.name,
          logoUrl: program.university.logoUrl,
          band: program.match?.band ?? null,
          detailsHref: `/universities/${program.university.slug}/programs/${program.slug}`,
        }));

  const entries: CompareEntry[] = columns.map((column) => ({
    id: column.id,
    kind,
    name: column.title,
    universityName: column.subtitle,
    logoUrl: column.logoUrl,
  }));

  if (columns.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <CompareBootstrap hasIds={ids.length > 0} />
        <ArrowLeftRight className="mx-auto size-10 text-[#98A0B4]" aria-hidden />
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

  const notSet = t("notSpecified");

  const groups: Group[] = kind === "faculty"
    ? (() => {
        const value = (faculty: (typeof faculties)[number]) => {
          const from = formatMoney(locale, faculty.tuitionFrom, faculty.currency);
          const to = formatMoney(locale, faculty.tuitionTo, faculty.currency);
          return {
            university: faculty.university.name,
            location: `${faculty.university.city}, ${faculty.university.country}`,
            programCount: formatNumber(locale, faculty.programCount),
            disciplines:
              faculty.disciplines
                .map((entry) => {
                  const field = FIELDS_OF_STUDY.find((f) => f.value === entry);
                  return field ? (isArabic ? field.ar : field.en) : entry;
                })
                .join("\n") || notSet,
            levels:
              faculty.studyLevels
                .map((level) => tCatalog(`levels.${level}`))
                .join("\n") || notSet,
            tuition:
              from && to && faculty.tuitionFrom !== faculty.tuitionTo
                ? `${from} - ${to}`
                : (from ?? notSet),
            minimumGrade:
              faculty.minGradePercent != null
                ? `${formatNumber(locale, faculty.minGradePercent)}${tCatalog("units.PERCENT")}`
                : notSet,
            scholarships: faculty.tags.includes("SCHOLARSHIPS_AVAILABLE")
              ? t("yes")
              : t("no"),
          };
        };
        const values = faculties.map(value);
        const column = <K extends keyof ReturnType<typeof value>>(key: K) =>
          values.map((entry) => entry[key]);

        return [
          {
            title: t("groups.overview"),
            rows: [
              { label: t("rows.university"), values: column("university") },
              { label: t("rows.location"), values: column("location") },
              { label: t("rows.programCount"), values: column("programCount") },
              { label: t("rows.levels"), values: column("levels") },
              { label: t("rows.disciplines"), values: column("disciplines") },
            ],
          },
          {
            title: t("groups.cost"),
            rows: [
              {
                label: t("rows.tuitionRange"),
                values: column("tuition"),
                highlight: true,
              },
            ],
          },
          {
            title: t("groups.requirements"),
            rows: [
              { label: t("rows.minimumGrade"), values: column("minimumGrade") },
              { label: t("rows.scholarships"), values: column("scholarships") },
            ],
          },
        ];
      })()
    : (() => {
        const value = (program: (typeof programs)[number]) => ({
          location: `${program.university.city}, ${program.university.country}`,
          level: tCatalog(`levels.${program.studyLevel}`),
          duration:
            program.durationLabel ??
            (yearsFromMonths(program.durationMonths)
              ? tCatalog("durationYears", {
                  count: yearsFromMonths(program.durationMonths)!,
                  value: formatNumber(
                    locale,
                    yearsFromMonths(program.durationMonths)!,
                  ),
                })
              : notSet),
          intake:
            program.intakes.length > 0
              ? program.intakes
                  .map(
                    (intake) =>
                      `${tCatalog(`seasons.${intake.season}`)} ${intake.year}`,
                  )
                  .join("\n")
              : notSet,
          faculty: program.facultyName ?? notSet,
          tuition: formatMoney(locale, program.tuitionFee, program.currency)
            ? `${formatMoney(locale, program.tuitionFee, program.currency)}${tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}`
            : notSet,
          applicationFee: program.applicationFeeWaived
            ? t("waived")
            : (formatMoney(locale, program.applicationFee, program.currency) ??
              notSet),
          coop: program.coopAvailable ? t("yes") : t("no"),
          scholarships: program.tags.includes("SCHOLARSHIPS_AVAILABLE")
            ? t("yes")
            : t("no"),
          creditHours: program.tags.includes("CREDIT_HOURS") ? t("yes") : t("no"),
          minimumGrade:
            program.minGradePercent != null
              ? `${formatNumber(locale, program.minGradePercent)}${tCatalog("units.PERCENT")}`
              : notSet,
          english:
            program.englishRequirements.length > 0
              ? program.englishRequirements
                  .map(
                    (requirement) =>
                      `${tCatalog(`englishTests.${requirement.test}`)} ${formatNumber(locale, requirement.minScore)}`,
                  )
                  .join("\n")
              : notSet,
        });
        const values = programs.map(value);
        const column = <K extends keyof ReturnType<typeof value>>(key: K) =>
          values.map((entry) => entry[key]);

        return [
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
              {
                label: t("rows.tuition"),
                values: column("tuition"),
                highlight: true,
              },
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
      })();

  const csv: CsvTable = {
    headers: ["", ...columns.map((c) => `${c.title} (${c.subtitle})`)],
    rows: groups.flatMap((group) =>
      group.rows.map((row) => [
        row.label,
        ...row.values.map((entry) => entry.replace(/\n/g, " / ")),
      ]),
    ),
  };

  const yesLabel = t("yes");
  const noLabel = t("no");

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 md:px-6 md:py-8">
      <CompareSync entries={entries} />

      {/* Print/PDF-only branding: invisible on screen (hidden, overridden by
          the print: variants below), so it never shows up while comparing
          in the app, only in the "Download > Print or save as PDF" output. */}
      <div
        aria-hidden
        className="hidden print:pointer-events-none print:fixed print:inset-0 print:flex print:items-center print:justify-center print:overflow-hidden"
      >
        {/* Chromium repeats position:fixed elements on every printed page,
            so this one watermark covers a multi-page comparison too.
            Deliberately no z-index trick to sit "behind" the table: a
            positioned element with default stacking already paints above
            plain in-flow content (the table), and relying on a negative
            z-index plus every table cell staying transparent turned out to
            be fragile — the table's own backgrounds ended up painting over
            it, hiding it completely. Faint enough (12% black) that sitting
            on top of the table doesn't hurt legibility, same as a real
            watermark. */}
        <span className="rotate-[-30deg] whitespace-nowrap text-[220px] font-black tracking-wide text-black/[0.12] select-none">
          UniLink
        </span>
      </div>

      <div
        aria-hidden
        className="hidden print:mb-5 print:flex print:items-center print:justify-between print:border-b print:border-slate-300 print:pb-3"
      >
        <Image
          src="/logo/unilink-logo-full-v2.png"
          alt="UniLink"
          width={451}
          height={134}
          className="h-8 w-auto"
        />
        <span className="text-xs text-slate-500">unilink.app</span>
      </div>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-11 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#1E6DEB]"
          >
            <ArrowLeftRight className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2A44]">
              {kind === "faculty" ? t("titleFaculties") : t("title")}
            </h1>
            <p className="text-sm text-[#5a6072]">
              {kind === "faculty"
                ? t("subtitleFaculties", { count: columns.length })
                : t("subtitle", { count: columns.length })}
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
              {columns.map((column) => {
                const bandStyle = column.band ? BAND_STYLES[column.band] : null;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    className="min-w-64 border-s border-b border-slate-200 bg-white p-4 text-start align-top"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <UniversityLogo
                        name={column.logoName}
                        logoUrl={column.logoUrl}
                        className="size-10"
                      />
                      <CompareRemoveButton
                        id={column.id}
                        name={column.title}
                        remainingIds={columns.map((entry) => entry.id)}
                      />
                    </div>

                    {column.band && bandStyle ? (
                      <span
                        className={cn(
                          "mt-3 flex items-center gap-1.5 text-xs font-semibold",
                          bandStyle.text,
                        )}
                      >
                        <span
                          className={cn("size-1.5 rounded-full", bandStyle.dot)}
                        />
                        {tSearch(`bands.${column.band}`)}
                      </span>
                    ) : null}

                    <p className="mt-2 text-sm font-bold text-[#1F2A44]">
                      {column.title}
                    </p>
                    <p className="mt-1 text-xs text-[#5a6072]">
                      {column.subtitle}
                    </p>

                    <Link
                      href={column.detailsHref}
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
                  colSpan={columns.length + 1}
                  className="bg-[#F7F9FE] px-4 py-2 text-start text-xs font-bold uppercase tracking-wider text-[#5a6072]"
                >
                  {group.title}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-t border-slate-100">
                  <th
                    scope="row"
                    className="bg-[#FCFDFF] px-4 py-3 text-start align-top text-sm font-semibold text-[#5a6072]"
                  >
                    {row.label}
                  </th>
                  {row.values.map((entry, index) => (
                    <td
                      key={`${row.label}-${columns[index]?.id ?? index}`}
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
                      ) : entry === noLabel ? (
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
