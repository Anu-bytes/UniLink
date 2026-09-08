"use client";

import { Library, Pencil, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  DataTable,
  EmptyState,
  type Column,
} from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatDate, formatNumber } from "@/lib/format";
import { admissionCoverage } from "@/lib/admin-catalogue";
import { CatalogueDetailsToggle, ContentChecklist, useCatalogueExpansion } from "@/components/admin/catalogue-details";

import { FacultyDeleteAction } from "./faculty-delete-action";
import { ICON_BUTTON, PRIMARY_BUTTON } from "./styles";
import type { FacultyRow } from "./types";

export function FacultyTable({
  rows,
  filtered,
}: {
  rows: FacultyRow[];
  /** A search or the university filter is active, so "nothing here" reads differently. */
  filtered: boolean;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const insights = useTranslations("Admin.catalogue");
  const { expanded, toggle } = useCatalogueExpansion();

  const columns: Column<FacultyRow>[] = [
    {
      key: "name",
      header: t("faculties.columns.name"),
      className: "w-[32%]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-[#EAF2FE] text-[#1E6DEB]"
          >
            {row.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element -- faculty
                 photos come from Supabase Storage or the university's own
                 domain, so next/image's loader cannot be relied on. */
              <img src={row.imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <Library className="size-4" />
            )}
          </span>

          <div className="min-w-0">
            <Link
              href={`/admin/faculties/${row.id}`}
              className="block whitespace-normal leading-5 [overflow-wrap:anywhere] font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <bdi>{locale === "ar" ? row.nameAr ?? row.name : row.name}</bdi>
            </Link>
            {row.nameAr ? (
              <span className="mt-1 block whitespace-normal text-[12px] leading-5 text-[#64748B] [overflow-wrap:anywhere]">
                <bdi>{locale === "ar" ? row.name : row.nameAr}</bdi>
              </span>
            ) : null}
            <CatalogueDetailsToggle id={row.id} name={locale === "ar" ? row.nameAr ?? row.name : row.name} checks={row.contentChecks} expanded={expanded.has(row.id)} onToggle={() => toggle(row.id)} />
          </div>
        </div>
      ),
    },
    {
      key: "university",
      header: t("faculties.columns.university"),
      cell: (row) => (
        <Link
          href={`/admin/universities/${row.university.id}`}
          className="block whitespace-normal leading-5 [overflow-wrap:anywhere] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {locale === "ar"
            ? (row.university.nameAr ?? row.university.name)
            : row.university.name}
        </Link>
      ),
    },
    {
      key: "programs",
      header: t("faculties.columns.programs"),
      className: "w-[220px]",
      cell: (row) => (
        <div className="space-y-1.5 text-[12px] leading-5">
          <Link href={`/admin/programs?universityId=${row.university.id}&facultyId=${row.id}`} className="font-semibold text-[#1E6DEB] hover:underline focus-visible:outline-2">
            {insights("programs", { count: row.programCount })}
          </Link>
          {row.programPreview.slice(0, 2).map((program) => <Link key={program.id} href={`/admin/programs/${program.id}`} className="block text-[#64748B] [overflow-wrap:anywhere] hover:text-[#1E6DEB] focus-visible:outline-2"><bdi>{locale === "ar" ? program.nameAr ?? program.name : program.name}</bdi></Link>)}
          {row.programCount > 2 ? <span className="block text-[11px] text-[#64748B]">+{formatNumber(locale, row.programCount - 2)}</span> : null}
        </div>
      ),
    },
    {
      key: "admissions",
      header: insights("admissions"),
      className: "w-[165px]",
      cell: (row) => (
        <Link href={`/admin/universities/${row.university.id}?tab=scores`} className={`block text-[12px] leading-5 hover:underline focus-visible:outline-2 ${row.scoreCount ? "text-emerald-700" : row.universityScoreCount ? "text-[#64748B]" : "text-amber-700"}`}>
          {insights(admissionCoverage(row.scoreCount, row.universityScoreCount))}
        </Link>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("common.actions")}</span>,
      align: "end",
      sticky: "end",
      className: "w-[108px]",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/faculties/${row.id}`}
            aria-label={`${t("common.edit")}: ${locale === "ar" ? row.nameAr ?? row.name : row.name}`}
            title={t("common.edit")}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <FacultyDeleteAction faculty={{ id: row.id, name: locale === "ar" ? row.nameAr ?? row.name : row.name }} variant="menu" after="refresh" />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      tableClassName="min-w-[960px] table-fixed [&_tbody_td]:py-4"
      expandedRowIds={expanded}
      renderExpandedRow={(row) => (
        <div id={`catalogue-details-${row.id}`} className="grid grid-cols-3 gap-6 p-1 text-xs leading-5 [overflow-wrap:anywhere]">
          <ContentChecklist checks={row.contentChecks} editHref={`/admin/faculties/${row.id}`} />
          <section className="min-w-0">
            <h3 className="mb-2 font-semibold text-[#0F172A]">{insights("admissions")}</h3>
            <p>{insights("facultyRuleCount", { count: row.scoreCount })}</p>
            <p>{insights("universityRuleCount", { count: row.universityScoreCount })}</p>
            <p className="mt-2 text-[#64748B]">{insights("scoreNote")}</p>
            <Link href={`/admin/universities/${row.university.id}?tab=scores`} className="mt-3 inline-block font-medium text-[#1E6DEB] hover:underline focus-visible:outline-2">{insights("reviewScores")}</Link>
          </section>
          <section className="min-w-0">
            <h3 className="mb-2 font-semibold text-[#0F172A]">{insights("technical")}</h3>
            <dl className="space-y-2">
              <div><dt className="text-[#64748B]">{insights("slug")}</dt><dd><bdi dir="ltr">{row.slug}</bdi></dd></div>
              <div><dt className="text-[#64748B]">{insights("order")}</dt><dd>{formatNumber(locale, row.sortOrder)}</dd></div>
              <div><dt className="text-[#64748B]">{insights("updated")}</dt><dd>{formatDate(locale, row.updatedAt)}</dd></div>
            </dl>
          </section>
        </div>
      )}
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      empty={
        filtered ? (
          <EmptyState
            icon={Library}
            title={t("faculties.noResults.title")}
            description={t("faculties.noResults.description")}
          />
        ) : (
          <EmptyState
            icon={Library}
            title={t("faculties.empty.title")}
            description={t("faculties.empty.description")}
            action={
              <Link href="/admin/faculties/new" className={PRIMARY_BUTTON}>
                <Plus className="size-4" aria-hidden />
                {t("faculties.new")}
              </Link>
            }
          />
        )
      }
    />
  );
}
