import { History } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, PageHeader } from "@/components/admin";
import { AdminControls } from "@/components/admin/admins/admin-controls";
import { RelativeDate } from "@/components/admin/overview/relative-date";
import { Link } from "@/i18n/navigation";
import { ADMIN_LEVEL, isAdminRole, requireAdminPage } from "@/lib/admin";
import { formatDate, formatNumber, initialsAvatar } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const STATUS_TONE = { ACTIVE: "green", DISABLED: "amber", BANNED: "red" } as const;

const ACTION_DOT: Record<string, string> = {
  create: "bg-[#0F7B45]",
  update: "bg-[#1E6DEB]",
  delete: "bg-[#C81F15]",
  submit: "bg-[#B77714]",
  approve: "bg-[#0F7B45]",
  reject: "bg-[#C81F15]",
  withdraw: "bg-slate-400",
};

export default async function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdminPage();
  const t = await getTranslations("Admin.admins");
  const tRoles = await getTranslations("Admin.enums.userRoles");
  const locale = await getLocale();
  const { id } = await params;

  const admin = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      statusReason: true,
      statusChangedAt: true,
      lastLoginAt: true,
      createdAt: true,
      adminAssignments: { select: { universityId: true } },
    },
  });
  if (!admin || !isAdminRole(admin.role)) notFound();

  const [recent, requestCounts, universities] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where: { actorId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.changeRequest.groupBy({ by: ["status"], where: { authorId: id }, _count: { _all: true } }),
    prisma.university.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, nameAr: true, slug: true } }),
  ]);

  const universityById = new Map(universities.map((university) => [university.id, university]));
  const nameOf = (university: { name: string; nameAr: string | null }) =>
    locale === "ar" ? (university.nameAr ?? university.name) : university.name;
  const countOf = (status: string) => requestCounts.find((row) => row.status === status)?._count._all ?? 0;
  const avatar = initialsAvatar(admin.name ?? admin.email);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        breadcrumb={[{ href: "/admin/admins", label: t("title") }, { label: admin.name ?? admin.email }]}
        title={
          <span className="flex items-center gap-3">
            <span
              aria-hidden
              style={{ background: avatar.background, color: avatar.color }}
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            >
              {avatar.initials}
            </span>
            {admin.name ?? admin.email}
          </span>
        }
        description={<span dir="ltr">{admin.email}</span>}
        actions={
          <>
            <Badge tone={STATUS_TONE[admin.status]} dot>
              {t(`status.${admin.status}`)}
            </Badge>
            <Badge tone="slate">
              {t("levels.levelN", { level: ADMIN_LEVEL[admin.role] })} · {tRoles(admin.role)}
            </Badge>
          </>
        }
      />

      {admin.status !== "ACTIVE" && admin.statusReason ? (
        <p className="mt-4 rounded-xl border border-[#F5C2BD] bg-[#FFF0EE] px-4 py-3 text-[13.5px] text-[#A8180F]">
          <span className="font-semibold">{t(`status.${admin.status}`)}:</span> {admin.statusReason}
          {admin.statusChangedAt ? <span className="text-[#C26A63]"> · {formatDate(locale, admin.statusChangedAt)}</span> : null}
        </p>
      ) : null}

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: t("facts.joined"), value: formatDate(locale, admin.createdAt) },
              { label: t("facts.lastSignIn"), value: admin.lastLoginAt ? formatDate(locale, admin.lastLoginAt) : t("never") },
              { label: t("facts.pending"), value: formatNumber(locale, countOf("PENDING")) },
              { label: t("facts.approved"), value: `${formatNumber(locale, countOf("APPROVED"))} / ${formatNumber(locale, countOf("APPROVED") + countOf("REJECTED"))}` },
            ].map((fact) => (
              <div key={fact.label} className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                <dt className="text-[12px] text-[#64748B]">{fact.label}</dt>
                <dd className="mt-1 text-[15px] font-semibold text-[#0F172A]">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <section className="rounded-xl border border-[#E2E8F0] bg-white">
            <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold text-[#0F172A]">
                <History className="size-4 text-[#64748B]" aria-hidden />
                {t("recentTitle")}
              </h2>
              {admin.role !== "ADMIN" ? (
                <Link href={`/admin/approvals?status=all&author=${admin.id}`} className="text-[13px] font-semibold text-[#1E6DEB] hover:underline">
                  {t("allTheirChanges")}
                </Link>
              ) : null}
            </header>
            {recent.length ? (
              <ol className="divide-y divide-slate-100">
                {recent.map((entry) => {
                  const university = entry.universityId ? universityById.get(entry.universityId) : undefined;
                  return (
                    <li key={entry.id} className="flex items-start gap-3 px-5 py-3">
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", ACTION_DOT[entry.action] ?? "bg-[#64748B]")} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] text-[#0F172A]">{entry.summary}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-[#94A3B8]">
                          <RelativeDate value={entry.createdAt} />
                          {university ? (
                            <>
                              <span aria-hidden>·</span>
                              <Link href={`/admin/universities/${university.id}`} className="font-semibold text-[#1E6DEB] hover:underline">
                                {nameOf(university)}
                              </Link>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="px-5 py-10 text-center text-[13.5px] text-[#64748B]">{t("noActivity")}</p>
            )}
          </section>
        </div>

        <AdminControls
          self={admin.id === actor.id}
          admin={{
            id: admin.id,
            email: admin.email,
            role: admin.role,
            status: admin.status,
            statusReason: admin.statusReason,
            universityIds: admin.adminAssignments.map((entry) => entry.universityId),
          }}
          universities={universities.map((university) => ({ value: university.id, label: nameOf(university) }))}
        />
      </div>
    </div>
  );
}
