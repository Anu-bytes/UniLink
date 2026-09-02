"use client";

import { Library, Pencil, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  DataTable,
  EmptyState,
  type Column,
} from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

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

  const columns: Column<FacultyRow>[] = [
    {
      key: "name",
      header: t("faculties.columns.name"),
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

          <span className="min-w-0">
            <Link
              href={`/admin/faculties/${row.id}`}
              className="block truncate font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              {row.name}
            </Link>
            {row.nameAr ? (
              <span className="block truncate text-[12.5px] text-[#64748B]" dir="rtl">
                {row.nameAr}
              </span>
            ) : null}
          </span>
        </div>
      ),
    },
    {
      key: "university",
      header: t("faculties.columns.university"),
      cell: (row) => (
        <Link
          href={`/admin/universities/${row.university.id}`}
          className="block max-w-[16rem] truncate transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {locale === "ar"
            ? (row.university.nameAr ?? row.university.name)
            : row.university.name}
        </Link>
      ),
    },
    {
      key: "slug",
      header: t("faculties.columns.slug"),
      cell: (row) => (
        <span className="block max-w-[14rem] truncate text-[12.5px] text-slate-400" dir="ltr">
          {row.slug}
        </span>
      ),
    },
    {
      key: "programs",
      header: t("faculties.columns.programs"),
      align: "end",
      className: "tabular-nums",
      cell: (row) => formatNumber(locale, row.programCount),
    },
    {
      key: "sortOrder",
      header: t("faculties.columns.sortOrder"),
      align: "end",
      className: "tabular-nums",
      cell: (row) => formatNumber(locale, row.sortOrder),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("common.actions")}</span>,
      align: "end",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/faculties/${row.id}`}
            aria-label={t("common.edit")}
            title={t("common.edit")}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <FacultyDeleteAction faculty={row} variant="icon" after="refresh" />
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
