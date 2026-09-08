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
                className="block whitespace-normal leading-5 [overflow-wrap:anywhere] font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                <bdi>{row.name ?? row.email}</bdi>
              </Link>
              {/* An address stays Latin on the Arabic side, so it carries its
                  own direction while the block keeps the page direction and the
                  name above it stays on the same edge. */}
              <span className="mt-1 block whitespace-normal leading-5 [overflow-wrap:anywhere] text-[12px] text-[#64748B]">
                <bdi dir="ltr">{row.email}</bdi>
              </span>
              {row.phone ? <span className="mt-1 block text-[12px] text-[#64748B] [overflow-wrap:anywhere]"><bdi dir="ltr">{row.phone}</bdi></span> : null}
            </span>
          </div>
        );
      },
    },
    {
      key: "role",
      header: t("users.columns.role"),
      className: "w-[116px]",
      cell: (row) => (
        <Badge tone={USER_ROLE_TONES[row.role]}>{tRole(row.role)}</Badge>
      ),
    },
    {
      key: "applications",
      header: t("users.columns.applications"),
      align: "end",
      className: "w-[110px] tabular-nums",
      cell: (row) => formatNumber(locale, row.applicationCount),
    },
    {
      key: "saved",
      header: t("users.columns.saved"),
      align: "end",
      className: "w-[90px] tabular-nums",
      cell: (row) => formatNumber(locale, row.savedCount),
    },
    {
      key: "joined",
      header: t("users.columns.joined"),
      className: "w-[156px]",
      cell: (row) => (
        <span className="whitespace-nowrap">{formatDate(locale, row.createdAt)}</span>
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
            href={`/admin/users/${row.id}`}
            aria-label={`${t("common.view")}: ${row.name ?? row.email}`}
            title={t("common.view")}
            className={ICON_BUTTON}
          >
            <Eye className="size-4" aria-hidden />
          </Link>

          <UserDeleteAction
            user={row}
            lock={row.lock}
            variant="menu"
            after="refresh"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      tableClassName="min-w-[860px] table-fixed [&_tbody_td]:py-4"
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
