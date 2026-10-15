import type { Prisma } from "@prisma/client";
import { Building2, ChevronRight, ClipboardCheck, ShieldCheck, ShieldOff, Users } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, PageHeader, StatCard, StatCardGrid, TableToolbar } from "@/components/admin";
import { AddAdminButton } from "@/components/admin/admins/add-admin-dialog";
import { RelativeDate } from "@/components/admin/overview/relative-date";
import { Link } from "@/i18n/navigation";
import { ADMIN_LEVEL, ADMIN_ROLES, requireAdminPage, type AdminRole } from "@/lib/admin";
import { formatNumber, initialsAvatar } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const ROLE_TABS = ["ALL", ...ADMIN_ROLES] as const;
const STATUS_TONE = { ACTIVE: "green", DISABLED: "amber", BANNED: "red" } as const;
const LEVEL_TINT: Record<AdminRole, string> = {
  ADMIN: "bg-[#0B1220] text-white",
  REVIEWER: "bg-[#E7F6EE] text-[#0F7B45]",
  UNIVERSITY_ADMIN: "bg-[#EEF3FF] text-[#1E6DEB]",
};

function single(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function AdminsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireAdminPage();
  const t = await getTranslations("Admin.admins");
  const tRoles = await getTranslations("Admin.enums.userRoles");
  const locale = await getLocale();
  const sp = await searchParams;

  const roleTab = (ROLE_TABS as readonly string[]).includes(single(sp.role)) ? single(sp.role) : "ALL";
  const q = single(sp.q).trim().slice(0, 120);

  const where: Prisma.UserWhereInput = {
    role: roleTab === "ALL" ? { in: [...ADMIN_ROLES] } : (roleTab as AdminRole),
    ...(q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
      : {}),
  };

  const [admins, byRole, inactive, pendingTotal, universities] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ role: "asc" }, { name: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        adminAssignments: { select: { university: { select: { id: true, name: true, nameAr: true } } } },
        _count: { select: { changeRequests: { where: { status: "PENDING" } } } },
      },
    }),
    prisma.user.groupBy({ by: ["role"], where: { role: { in: [...ADMIN_ROLES] } }, _count: { _all: true } }),
    prisma.user.count({ where: { role: { in: [...ADMIN_ROLES] }, status: { not: "ACTIVE" } } }),
    prisma.changeRequest.count({ where: { status: "PENDING" } }),
    prisma.university.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, nameAr: true } }),
  ]);

  const lastActivity = new Map(
    (
      await prisma.adminAuditLog.groupBy({
        by: ["actorId"],
        where: { actorId: { in: admins.map((admin) => admin.id) } },
        _max: { createdAt: true },
      })
    ).map((row) => [row.actorId, row._max.createdAt]),
  );

  const countFor = (role: string) =>
    role === "ALL"
      ? byRole.reduce((sum, row) => sum + row._count._all, 0)
      : (byRole.find((row) => row.role === role)?._count._all ?? 0);

  const universityName = (university: { name: string; nameAr: string | null }) =>
    locale === "ar" ? (university.nameAr ?? university.name) : university.name;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <AddAdminButton
            universities={universities.map((university) => ({ value: university.id, label: universityName(university) }))}
          />
        }
      />

      <div className="mt-6">
        <StatCardGrid>
          <StatCard label={t("stats.total")} value={formatNumber(locale, countFor("ALL"))} icon={Users} />
          <StatCard label={tRoles("ADMIN")} value={formatNumber(locale, countFor("ADMIN"))} icon={ShieldCheck} />
          <StatCard label={tRoles("REVIEWER")} value={formatNumber(locale, countFor("REVIEWER"))} icon={ClipboardCheck} tone="positive" />
          <StatCard
            label={tRoles("UNIVERSITY_ADMIN")}
            value={formatNumber(locale, countFor("UNIVERSITY_ADMIN"))}
            icon={Building2}
            hint={inactive ? t("stats.inactive", { count: inactive }) : undefined}
          />
        </StatCardGrid>
      </div>

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200" aria-label={t("roleNav")}>
        {ROLE_TABS.map((role) => {
          const active = role === roleTab;
          const params = new URLSearchParams();
          if (role !== "ALL") params.set("role", role);
          if (q) params.set("q", q);
          return (
            <Link
              key={role}
              href={`/admin/admins${params.size ? `?${params}` : ""}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-[13.5px] font-semibold",
                active ? "border-[#1E6DEB] text-[#1E6DEB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              {role === "ALL" ? t("allLevels") : tRoles(role)}
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] leading-none font-bold tabular-nums">
                {formatNumber(locale, countFor(role))}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-4">
        <TableToolbar placeholder={t("search")} total={admins.length} />

        {pendingTotal > 0 ? (
          <Link
            href="/admin/approvals"
            className="flex items-center justify-between gap-3 rounded-xl border border-[#F3DFB4] bg-[#FFFBF2] px-4 py-3 text-[13.5px] font-semibold text-[#5C4310] hover:bg-[#FFF6E5]"
          >
            {t("pendingBanner", { count: pendingTotal })}
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-[13.5px]">
              <thead className="bg-[#F8FAFC] text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 text-start">{t("columns.admin")}</th>
                  <th className="px-4 py-3 text-start">{t("columns.level")}</th>
                  <th className="px-4 py-3 text-start">{t("columns.status")}</th>
                  <th className="px-4 py-3 text-start">{t("columns.universities")}</th>
                  <th className="px-4 py-3 text-start">{t("columns.lastSignIn")}</th>
                  <th className="px-4 py-3 text-start">{t("columns.lastActivity")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => {
                  const role = admin.role as AdminRole;
                  const avatar = initialsAvatar(admin.name ?? admin.email);
                  const assigned = admin.adminAssignments.map((entry) => entry.university);
                  const activity = lastActivity.get(admin.id);
                  return (
                    <tr key={admin.id} className="hover:bg-[#FAFBFC]">
                      <td className="px-4 py-3">
                        <Link href={`/admin/admins/${admin.id}`} className="flex items-center gap-3">
                          <span
                            aria-hidden
                            style={{ background: avatar.background, color: avatar.color }}
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          >
                            {avatar.initials}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-[#0F172A]">
                              {admin.name ?? admin.email}
                              {admin.id === actor.id ? <span className="ms-1.5 text-[11.5px] font-medium text-[#94A3B8]">({t("you")})</span> : null}
                            </span>
                            <span dir="ltr" className="block truncate text-[12.5px] text-[#64748B]">{admin.email}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold", LEVEL_TINT[role])}>
                          {t("levels.levelN", { level: ADMIN_LEVEL[role] })} · {tRoles(role)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={STATUS_TONE[admin.status]} dot>
                          {t(`status.${admin.status}`)}
                        </Badge>
                        {admin._count.changeRequests > 0 ? (
                          <span className="mt-1 block text-[11.5px] font-semibold text-[#B77714]">
                            {t("pendingCount", { count: admin._count.changeRequests })}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {role === "UNIVERSITY_ADMIN" ? (
                          assigned.length ? (
                            <span className="flex flex-wrap gap-1">
                              {assigned.slice(0, 2).map((university) => (
                                <span key={university.id} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[12px] text-[#334155]">
                                  {universityName(university)}
                                </span>
                              ))}
                              {assigned.length > 2 ? (
                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[12px] font-semibold text-[#64748B]">
                                  +{formatNumber(locale, assigned.length - 2)}
                                </span>
                              ) : null}
                            </span>
                          ) : (
                            <span className="text-[12.5px] font-semibold text-[#C81F15]">{t("noAssignments")}</span>
                          )
                        ) : (
                          <span className="text-[12.5px] text-[#94A3B8]">{t("allUniversities")}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {admin.lastLoginAt ? <RelativeDate value={admin.lastLoginAt} /> : <span className="text-[12.5px] text-[#94A3B8]">{t("never")}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {activity ? <RelativeDate value={activity} /> : <span className="text-[12.5px] text-[#94A3B8]">{t("noActivity")}</span>}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Link
                          href={`/admin/admins/${admin.id}`}
                          className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 text-[13px] font-semibold text-[#1E6DEB] hover:bg-[#EEF3FF]"
                        >
                          {t("manage")}
                          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[13.5px] text-[#64748B]">
                      <ShieldOff className="mx-auto mb-2 size-6 text-slate-300" aria-hidden />
                      {t("empty")}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
