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
      header: t("programs.columns.program"),
      className: "w-[35%] py-4",
      cell: (row) => (
        <div className="min-w-0">
          <Link
            href={`/admin/programs/${row.id}`}
            title={locale === "ar" ? row.nameAr ?? row.name : row.name}
            className="block whitespace-normal font-semibold leading-5 text-[#0F172A] [overflow-wrap:anywhere] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <bdi>{locale === "ar" ? row.nameAr ?? row.name : row.name}</bdi>
          </Link>
          {row.nameAr ? (
            <span className="mt-1 block whitespace-normal text-[12px] leading-5 text-[#64748B] [overflow-wrap:anywhere]">
              <bdi>{locale === "ar" ? row.name : row.nameAr}</bdi>
            </span>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] leading-4 text-[#64748B]">
            <span>{tCatalog(`levels.${row.studyLevel}`)}</span>
            <span aria-hidden>·</span>
            <span className="[overflow-wrap:anywhere]">{fieldOfStudyLabel(locale, row.fieldOfStudy)}</span>
          </div>
        </div>
      ),
    },
    {
      key: "university",
      header: t("programs.columns.institution"),
      className: "py-4",
      cell: (row) => (
        <div className="space-y-1.5 whitespace-normal leading-5 [overflow-wrap:anywhere]">
          <Link
            href={`/admin/universities/${row.university.id}`}
            className="block font-medium text-[#334155] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <bdi>{locale === "ar"
              ? (row.university.nameAr ?? row.university.name)
              : row.university.name}</bdi>
          </Link>
          {row.faculty ? (
            <Link
              href={`/admin/faculties/${row.faculty.id}`}
              className="block text-[12px] text-[#64748B] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <bdi>{locale === "ar"
                ? (row.faculty.nameAr ?? row.faculty.name)
                : row.faculty.name}</bdi>
            </Link>
          ) : (
            <span className="text-[12px] text-[#64748B]">{t("programs.columns.faculty")}: {t("common.notSet")}</span>
          )}
        </div>
      ),
    },
    {
      key: "tuitionFee",
      header: t("programs.columns.tuition"),
      align: "end",
      className: "w-[150px] whitespace-nowrap py-4 tabular-nums",
      cell: (row) => {
        // Each program carries its own currency, so the column is formatted
        // per row rather than once for the table.
        const amount = formatMoney(locale, row.tuitionFee, row.currency);
        if (!amount) return <span className="text-slate-400">{t("common.notSet")}</span>;
        return (
          <div>
            <span className="block font-semibold text-[#334155]"><bdi>{amount}</bdi></span>
            <span className="mt-1 block text-[12px] text-[#64748B]">{t(`programs.tuitionPeriods.${row.tuitionPeriod}`)}</span>
          </div>
        );
      },
    },
    {
      key: "isPublished",
      header: t("programs.columns.status"),
      className: "w-[112px] whitespace-nowrap py-4",
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
      className: "w-[108px] py-4",
      // Keep actions reachable when the table scrolls on a narrow screen.
      sticky: "end",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/programs/${row.id}`}
            aria-label={`${t("common.edit")}: ${locale === "ar" ? row.nameAr ?? row.name : row.name}`}
            title={t("common.edit")}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <ProgramDeleteAction
            program={{ id: row.id, name: locale === "ar" ? row.nameAr ?? row.name : row.name }}
            variant="menu"
            after="refresh"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      tableClassName="min-w-[800px] table-fixed"
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
