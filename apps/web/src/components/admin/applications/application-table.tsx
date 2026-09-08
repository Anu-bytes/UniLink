"use client";

import { Eye, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge, DataTable, EmptyState, type Column } from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatDate, initialsAvatar } from "@/lib/format";

import { ApplicationStatusSelect } from "./application-status-select";
import { ICON_BUTTON } from "./styles";
import {
  APPLICATION_STATUS_TONES,
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
  const tStatus = useTranslations("Applications.status");
  const locale = useLocale();

  const columns: Column<ApplicationRow>[] = [
    {
      key: "student",
      header: t("applications.columns.student"),
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
                className="block truncate font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                {label}
              </Link>
              {/* An address stays Latin on the Arabic side, so it carries its
                  own direction while the block keeps the page direction. */}
              <span className="block max-w-[16rem] truncate text-[12.5px] text-[#64748B]">
                <span dir="ltr">{row.user.email}</span>
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
      className: "max-w-[240px]",
      cell: (row) => (
        <span className="block min-w-0">
          <span className="block truncate font-medium text-[#0F172A]">
            {row.program.name}
          </span>
          {row.program.nameAr ? (
            <span
              dir="rtl"
              className="block truncate text-[12.5px] text-[#64748B]"
            >
              {row.program.nameAr}
            </span>
          ) : null}
          <span className="block truncate text-[12px] text-slate-400">
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
      cell: (row) => (
        <Badge tone={APPLICATION_STATUS_TONES[row.status]} dot>
          {tStatus(row.status)}
        </Badge>
      ),
    },
    {
      key: "submitted",
      header: t("applications.columns.submitted"),
      cell: (row) =>
        row.submittedAt ? (
          <span className="whitespace-nowrap">
            {formatDate(locale, row.submittedAt)}
          </span>
        ) : (
          <span className="text-slate-400">
            {t("applications.notSubmitted")}
          </span>
        ),
    },
    {
      key: "updated",
      header: t("applications.columns.updated"),
      cell: (row) => (
        <span className="whitespace-nowrap">
          {formatDate(locale, row.updatedAt)}
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
          <ApplicationStatusSelect
            id={row.id}
            status={row.status}
            applicant={applicantLabel(row.user)}
          />
          <Link
            href={`/admin/applications/${row.id}`}
            aria-label={t("common.view")}
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
