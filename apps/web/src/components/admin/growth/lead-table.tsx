"use client";

import { Eye, Inbox } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { DataTable, EmptyState, type Column } from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";

import { DeleteAction } from "./delete-action";
import { ICON_BUTTON } from "./styles";
import type { LeadRow } from "./types";

/**
 * Every cell here is a string an anonymous visitor typed into the public
 * partnership form. It is rendered as text and nothing else — no markup, no
 * dangerouslySetInnerHTML — and the only escape hatches are the `mailto:` and
 * `tel:` links, which is the entire point of an inbox.
 */
export function LeadTable({
  rows,
  filtered,
}: {
  rows: LeadRow[];
  /** A search is active, so "nothing here" reads differently. */
  filtered: boolean;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  const columns: Column<LeadRow>[] = [
    {
      key: "university",
      header: t("leads.columns.university"),
      className: "w-[36%]",
      cell: (row) => (
        <div>
        <Link
          href={`/admin/leads/${row.id}`}
          className="block whitespace-normal leading-5 [overflow-wrap:anywhere] font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          <bdi>{row.universityName}</bdi>
        </Link>
        <span className="mt-1 block text-[12px] text-[#64748B] [overflow-wrap:anywhere]"><bdi>{row.city}</bdi></span>
        </div>
      ),
    },
    {
      key: "contact",
      header: t("leads.columns.contact"),
      cell: (row) => (
        <span className="block min-w-0">
          <span className="block whitespace-normal font-medium leading-5 text-[#0F172A] [overflow-wrap:anywhere]">
            <bdi>{row.contactFirstName} {row.contactLastName}</bdi>
          </span>
          <span className="mt-1 block whitespace-normal leading-5 [overflow-wrap:anywhere] text-[12px] text-[#64748B]">
            <bdi>{row.contactTitle}</bdi>
          </span>
          <a href={`mailto:${row.contactEmail}`} className="mt-2 block text-[12px] text-[#1E6DEB] [overflow-wrap:anywhere] hover:underline focus-visible:outline-2"><bdi dir="ltr">{row.contactEmail}</bdi></a>
          <a href={`tel:${row.phone}`} className="mt-1 block text-[12px] text-[#1E6DEB] [overflow-wrap:anywhere] hover:underline focus-visible:outline-2"><bdi dir="ltr">{row.phone}</bdi></a>
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("leads.columns.received"),
      className: "w-[156px]",
      cell: (row) => (
        <span className="whitespace-nowrap text-[#64748B]">
          {formatDate(locale, row.createdAt)}
        </span>
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
            href={`/admin/leads/${row.id}`}
            aria-label={`${t("common.view")}: ${row.universityName}`}
            title={t("common.view")}
            className={ICON_BUTTON}
          >
            <Eye className="size-4" aria-hidden />
          </Link>

          <DeleteAction
            section="leads"
            id={row.id}
            name={row.universityName}
            variant="menu"
            after="refresh"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      tableClassName="min-w-[760px] table-fixed [&_tbody_td]:py-4"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      empty={
        filtered ? (
          <EmptyState
            icon={Inbox}
            title={t("leads.noResults.title")}
            description={t("leads.noResults.description")}
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title={t("leads.empty.title")}
            description={t("leads.empty.description")}
          />
        )
      }
    />
  );
}
