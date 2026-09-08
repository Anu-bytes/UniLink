"use client";

import { Award, Pencil, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  Badge,
  DataTable,
  EmptyState,
  type Column,
} from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatDate, formatMoney } from "@/lib/format";

import { DeleteAction } from "./delete-action";
import { ICON_BUTTON, PRIMARY_BUTTON } from "./styles";
import type { ScholarshipRow } from "./types";

export function ScholarshipTable({
  rows,
  filtered,
}: {
  rows: ScholarshipRow[];
  /** A search or one of the filters is active, so "nothing here" reads differently. */
  filtered: boolean;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  const columns: Column<ScholarshipRow>[] = [
    {
      key: "title",
      header: t("scholarships.columns.title"),
      cell: (row) => (
        <span className="block min-w-0">
          <Link
            href={`/admin/scholarships/${row.id}`}
            className="block whitespace-normal leading-5 [overflow-wrap:anywhere] font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <bdi>{locale === "ar" ? row.titleAr ?? row.title : row.title}</bdi>
          </Link>
          {row.titleAr ? (
            <span className="mt-1 block whitespace-normal leading-5 text-[12px] text-[#64748B] [overflow-wrap:anywhere]">
              <bdi>{locale === "ar" ? row.title : row.titleAr}</bdi>
            </span>
          ) : null}
          <span className="mt-2 block text-[12px] text-[#64748B]">
          {row.university ? (
          <Link
            href={`/admin/universities/${row.university.id}`}
            className="block whitespace-normal leading-5 [overflow-wrap:anywhere] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {locale === "ar"
              ? (row.university.nameAr ?? row.university.name)
              : row.university.name}
          </Link>
        ) : (
          <Badge tone="blue">{t("scholarships.platformWide")}</Badge>
        )}
          </span>
        </span>
      ),
    },
    {
      key: "funding",
      header: t("scholarships.columns.funding"),
      align: "end",
      className: "w-[150px] tabular-nums whitespace-nowrap font-semibold",
      cell: (row) =>
        formatMoney(locale, row.fundingAmount, row.currency) ?? (
          <span className="text-slate-400">{t("common.notSet")}</span>
        ),
    },
    {
      key: "deadline",
      header: t("scholarships.columns.deadline"),
      className: "w-[156px]",
      cell: (row) => {
        if (!row.applicationDeadline) {
          return <span className="text-slate-400">{t("common.notSet")}</span>;
        }
        // A deadline that has already passed is still on the public site until
        // someone unpublishes it, so it is called out here rather than left as
        // one more date in a column of dates.
        return (
          <span className="flex flex-wrap items-center gap-2">
            <span
              className={
                row.deadlinePassed
                  ? "whitespace-nowrap font-medium text-[#C81F15]"
                  : "whitespace-nowrap text-[#334155]"
              }
            >
              {formatDate(locale, row.applicationDeadline)}
            </span>
            {row.deadlinePassed ? (
              <Badge tone="red">{t("scholarships.expired")}</Badge>
            ) : null}
          </span>
        );
      },
    },
    {
      key: "status",
      header: t("scholarships.columns.status"),
      className: "w-[112px]",
      cell: (row) => (
        <Badge tone={row.isPublished ? "green" : "neutral"} dot>
          {row.isPublished ? t("common.published") : t("common.draft")}
        </Badge>
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
            href={`/admin/scholarships/${row.id}`}
            aria-label={`${t("common.edit")}: ${locale === "ar" ? row.titleAr ?? row.title : row.title}`}
            title={t("common.edit")}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <DeleteAction
            section="scholarships"
            id={row.id}
            name={locale === "ar" ? row.titleAr ?? row.title : row.title}
            variant="menu"
            after="refresh"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      tableClassName="min-w-[800px] table-fixed [&_tbody_td]:py-4"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      empty={
        filtered ? (
          <EmptyState
            icon={Award}
            title={t("scholarships.noResults.title")}
            description={t("scholarships.noResults.description")}
          />
        ) : (
          <EmptyState
            icon={Award}
            title={t("scholarships.empty.title")}
            description={t("scholarships.empty.description")}
            action={
              <Link href="/admin/scholarships/new" className={PRIMARY_BUTTON}>
                <Plus className="size-4" aria-hidden />
                {t("scholarships.new")}
              </Link>
            }
          />
        )
      }
    />
  );
}
