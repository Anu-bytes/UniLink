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
      cell: (row) => (
        <Link
          href={`/admin/leads/${row.id}`}
          className="block max-w-[18rem] truncate font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {row.universityName}
        </Link>
      ),
    },
    {
      key: "city",
      header: t("leads.columns.city"),
      cell: (row) => (
        <span className="block max-w-[10rem] truncate">{row.city}</span>
      ),
    },
    {
      key: "contact",
      header: t("leads.columns.contact"),
      cell: (row) => (
        <span className="block min-w-0">
          <span className="block truncate text-[#0F172A]">
            {row.contactFirstName} {row.contactLastName}
          </span>
          <span className="block truncate text-[12.5px] text-[#64748B]">
            {row.contactTitle}
          </span>
        </span>
      ),
    },
    {
      key: "email",
      header: t("leads.columns.email"),
      cell: (row) => (
        <a
          href={`mailto:${row.contactEmail}`}
          dir="ltr"
          className="block max-w-[16rem] truncate text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {row.contactEmail}
        </a>
      ),
    },
    {
      key: "phone",
      header: t("leads.columns.phone"),
      cell: (row) => (
        <a
          href={`tel:${row.phone}`}
          dir="ltr"
          className="block whitespace-nowrap text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {row.phone}
        </a>
      ),
    },
    {
      key: "createdAt",
      header: t("leads.columns.received"),
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
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/leads/${row.id}`}
            aria-label={t("common.view")}
            title={t("common.view")}
            className={ICON_BUTTON}
          >
            <Eye className="size-4" aria-hidden />
          </Link>

          <DeleteAction
            section="leads"
            id={row.id}
            name={row.universityName}
            variant="icon"
            after="refresh"
          />
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
