"use client";

import { Eye, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge, DataTable, EmptyState, type Column } from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatDate, formatNumber, initialsAvatar } from "@/lib/format";

import { ICON_BUTTON, SECONDARY_BUTTON } from "./styles";
import { USER_ROLE_TONES } from "./tones";
import type { UserRow } from "./types";
import { UserDeleteAction } from "./user-delete-action";

export function UserTable({
  rows,
  filtered,
}: {
  rows: UserRow[];
  /** A search or one of the filters is active, so "nothing here" reads differently. */
  filtered: boolean;
}) {
  const t = useTranslations("Admin");
  const tRole = useTranslations("Admin.enums.userRoles");
  const locale = useLocale();

  const columns: Column<UserRow>[] = [
    {
      key: "user",
      header: t("users.columns.user"),
      cell: (row) => {
        const avatar = initialsAvatar(row.name ?? row.email);

        return (
          <div className="flex items-center gap-3">
            {row.image ? (
              /* eslint-disable-next-line @next/next/no-img-element -- avatars
                 come from whichever OAuth provider the account signed in with,
                 so next/image's configured loader cannot be relied on. */
              <img
                src={row.image}
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
                href={`/admin/users/${row.id}`}
                className="block truncate font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                {row.name ?? row.email}
              </Link>
              {/* An address stays Latin on the Arabic side, so it carries its
                  own direction while the block keeps the page direction and the
                  name above it stays on the same edge. */}
              <span className="block max-w-[18rem] truncate text-[12.5px] text-[#64748B]">
                <span dir="ltr">{row.email}</span>
              </span>
            </span>
          </div>
        );
      },
    },
    {
      key: "role",
      header: t("users.columns.role"),
      cell: (row) => (
        <Badge tone={USER_ROLE_TONES[row.role]}>{tRole(row.role)}</Badge>
      ),
    },
    {
      key: "phone",
      header: t("users.columns.phone"),
      cell: (row) =>
        row.phone ? (
          <span dir="ltr" className="whitespace-nowrap">
            {row.phone}
          </span>
        ) : (
          <span className="text-slate-400">{t("common.notSet")}</span>
        ),
    },
    {
      key: "applications",
      header: t("users.columns.applications"),
      align: "end",
      className: "tabular-nums",
      cell: (row) => formatNumber(locale, row.applicationCount),
    },
    {
      key: "saved",
      header: t("users.columns.saved"),
      align: "end",
      className: "tabular-nums",
      cell: (row) => formatNumber(locale, row.savedCount),
    },
    {
      key: "joined",
      header: t("users.columns.joined"),
      cell: (row) => (
        <span className="whitespace-nowrap">{formatDate(locale, row.createdAt)}</span>
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
            href={`/admin/users/${row.id}`}
            aria-label={t("common.view")}
            title={t("common.view")}
            className={ICON_BUTTON}
          >
            <Eye className="size-4" aria-hidden />
          </Link>

          <UserDeleteAction
            user={row}
            lock={row.lock}
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
            icon={Users}
            title={t("users.noResults.title")}
            description={t("users.noResults.description")}
            action={
              <Link href="/admin/users" className={SECONDARY_BUTTON}>
                {t("common.clearFilters")}
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={Users}
            title={t("users.empty.title")}
            description={t("users.empty.description")}
          />
        )
      }
    />
  );
}
