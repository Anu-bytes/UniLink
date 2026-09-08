"use client";

import { Eye, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { DataTable, EmptyState, type Column } from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatDate, initialsAvatar } from "@/lib/format";

import { ApplicationStatusSelect } from "./application-status-select";
import { ICON_BUTTON } from "./styles";
import {
  applicantLabel,
  localizedName,
  type ApplicationRow,
} from "./types";

export function ApplicationTable({
  rows,
  filtered,
}: {
  rows: ApplicationRow[];
  /** A search, a chip or the university filter is active, so "nothing here" reads differently. */
  filtered: boolean;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  const columns: Column<ApplicationRow>[] = [
    {
      key: "student",
      header: t("applications.columns.student"),
      className: "w-[30%]",
      cell: (row) => {
        const label = applicantLabel(row.user);
        const avatar = initialsAvatar(label);

        return (
          <div className="flex items-center gap-3">
            {row.user.image ? (
              /* eslint-disable-next-line @next/next/no-img-element -- avatars
                 come from whichever OAuth provider the account signed in with,
                 so next/image's configured loader cannot be relied on. */
              <img
                src={row.user.image}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                style={{ background: avatar.background, color: avatar.color }}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              >
                {avatar.initials}
              </span>
            )}

            <span className="min-w-0">
              <Link
                href={`/admin/applications/${row.id}`}
                className="block whitespace-normal leading-5 [overflow-wrap:anywhere] font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                <bdi>{label}</bdi>
              </Link>
              {/* An address stays Latin on the Arabic side, so it carries its
                  own direction while the block keeps the page direction. */}
              <span className="mt-1 block whitespace-normal leading-5 [overflow-wrap:anywhere] text-[12px] text-[#64748B]">
                <bdi dir="ltr">{row.user.email}</bdi>
              </span>
            </span>
          </div>
        );
      },
    },
    {
      key: "program",
      header: t("applications.columns.program"),
      // Capped: programme names run long, and an uncapped cell widens the
      // table until the status select falls off the screen.
      cell: (row) => (
        <span className="block min-w-0">
          <span className="block whitespace-normal leading-5 [overflow-wrap:anywhere] font-medium text-[#0F172A]">
            <bdi>{localizedName(locale, row.program.name, row.program.nameAr)}</bdi>
          </span>
          {row.program.nameAr ? (
            <span
              className="mt-1 block whitespace-normal leading-5 [overflow-wrap:anywhere] text-[12px] text-[#64748B]"
            >
              <bdi>{locale === "ar" ? row.program.name : row.program.nameAr}</bdi>
            </span>
          ) : null}
          <span className="mt-2 block whitespace-normal leading-5 [overflow-wrap:anywhere] text-[12px] text-[#64748B]">
            {localizedName(
              locale,
              row.program.university.name,
              row.program.university.nameAr,
            )}
          </span>
        </span>
      ),
    },
    {
      key: "status",
      header: t("applications.columns.status"),
      className: "w-[190px]",
      cell: (row) => (
        <ApplicationStatusSelect
            id={row.id}
            status={row.status}
            applicant={applicantLabel(row.user)}
          />
      ),
    },
    {
      key: "submitted",
      header: t("applications.columns.submitted"),
      className: "w-[154px]",
      cell: (row) => (
        <div className="space-y-1.5">
        {row.submittedAt ? (
          <span className="whitespace-nowrap">
            {formatDate(locale, row.submittedAt)}
          </span>
        ) : (
          <span className="text-slate-400">
            {t("applications.notSubmitted")}
          </span>
        )}
        <span className="block text-[11.5px] leading-4 text-[#64748B]">{t("applications.columns.updated")}<br />{formatDate(locale, row.updatedAt)}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("common.actions")}</span>,
      align: "end",
      sticky: "end",
      className: "w-[68px]",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">

          <Link
            href={`/admin/applications/${row.id}`}
            aria-label={`${t("common.view")}: ${applicantLabel(row.user)}`}
            title={t("common.view")}
            className={ICON_BUTTON}
          >
            <Eye className="size-4" aria-hidden />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      tableClassName="min-w-[920px] table-fixed [&_tbody_td]:py-4"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      empty={
        filtered ? (
          <EmptyState
            icon={FileText}
            title={t("applications.noResults.title")}
            description={t("applications.noResults.description")}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title={t("applications.empty.title")}
            description={t("applications.empty.description")}
          />
        )
      }
    />
  );
}
