"use client";

import { GraduationCap, Pencil, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge, DataTable, EmptyState, type Column } from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/format";

import { fieldOfStudyLabel } from "./field-options";
import { ProgramDeleteAction } from "./program-delete-action";
import { ICON_BUTTON, PRIMARY_BUTTON } from "./styles";
import type { ProgramRow } from "./types";

export function ProgramTable({
  rows,
  filtered,
}: {
  rows: ProgramRow[];
  /** A search or a filter is active, so "nothing here" reads differently. */
  filtered: boolean;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();

  const columns: Column<ProgramRow>[] = [
    {
      key: "name",
      header: t("programs.columns.name"),
      cell: (row) => (
        <div className="min-w-0">
          <Link
            href={`/admin/programs/${row.id}`}
            className="block max-w-[15rem] truncate font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {row.name}
          </Link>
          {row.nameAr ? (
            <span className="block max-w-[15rem] truncate text-[12.5px] text-[#64748B]" dir="rtl">
              {row.nameAr}
            </span>
          ) : null}
          <span className="block max-w-[15rem] truncate text-[12px] text-slate-400" dir="ltr">
            {row.slug}
          </span>
        </div>
      ),
    },
    {
      key: "university",
      header: t("programs.columns.university"),
      cell: (row) => (
        <Link
          href={`/admin/universities/${row.university.id}`}
          className="block max-w-[9.5rem] truncate transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {locale === "ar"
            ? (row.university.nameAr ?? row.university.name)
            : row.university.name}
        </Link>
      ),
    },
    {
      key: "faculty",
      header: t("programs.columns.faculty"),
      cell: (row) =>
        row.faculty ? (
          <Link
            href={`/admin/faculties/${row.faculty.id}`}
            className="block max-w-[9.5rem] truncate transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {locale === "ar"
              ? (row.faculty.nameAr ?? row.faculty.name)
              : row.faculty.name}
          </Link>
        ) : (
          <span className="text-slate-400">{t("common.notSet")}</span>
        ),
    },
    {
      key: "studyLevel",
      header: t("programs.columns.level"),
      cell: (row) => <Badge tone="blue">{tCatalog(`levels.${row.studyLevel}`)}</Badge>,
    },
    {
      key: "fieldOfStudy",
      header: t("programs.columns.fieldOfStudy"),
      cell: (row) => (
        <span className="block max-w-[12rem] truncate">
          {fieldOfStudyLabel(locale, row.fieldOfStudy)}
        </span>
      ),
    },
    {
      key: "tuitionFee",
      header: t("programs.columns.tuition"),
      align: "end",
      className: "whitespace-nowrap tabular-nums",
      cell: (row) => {
        // Each program carries its own currency, so the column is formatted
        // per row rather than once for the table.
        const amount = formatMoney(locale, row.tuitionFee, row.currency);
        if (!amount) return <span className="text-slate-400">{t("common.notSet")}</span>;
        return `${amount}${tCatalog(`tuitionPeriods.${row.tuitionPeriod}`)}`;
      },
    },
    {
      key: "isPublished",
      header: t("programs.columns.status"),
      cell: (row) =>
        row.isPublished ? (
          <Badge tone="green" dot>
            {t("common.published")}
          </Badge>
        ) : (
          <Badge tone="neutral" dot>
            {t("common.draft")}
          </Badge>
        ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("common.actions")}</span>,
      align: "end",
      // Eight columns overflow a laptop, and Edit and Delete must not end up
      // behind a horizontal scroll nobody thinks to perform.
      sticky: "end",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/programs/${row.id}`}
            aria-label={t("common.edit")}
            title={t("common.edit")}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <ProgramDeleteAction program={row} variant="icon" after="refresh" />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      empty={
        filtered ? (
          <EmptyState
            icon={GraduationCap}
            title={t("programs.noResults.title")}
            description={t("programs.noResults.description")}
          />
        ) : (
          <EmptyState
            icon={GraduationCap}
            title={t("programs.empty.title")}
            description={t("programs.empty.description")}
            action={
              <Link href="/admin/programs/new" className={PRIMARY_BUTTON}>
                <Plus className="size-4" aria-hidden />
                {t("programs.new")}
              </Link>
            }
          />
        )
      }
    />
  );
}
