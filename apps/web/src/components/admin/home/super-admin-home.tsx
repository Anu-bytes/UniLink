import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileClock,
  FileText,
  GraduationCap,
  Handshake,
  ImageOff,
  Library,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { RecentLeads } from "@/components/admin/overview/recent-leads";
import { RecentUsers } from "@/components/admin/overview/recent-users";
import { RelativeDate } from "@/components/admin/overview/relative-date";
import { PipelineStrip } from "@/components/admin/overview/pipeline-strip";
import { Link } from "@/i18n/navigation";
import type { AdminActor } from "@/lib/admin";
import { UNIVERSITY_MISSING_CONTENT } from "@/lib/admin-catalogue";
import { QUICK_ACTION_ICONS, adminQuickActions } from "@/lib/admin-nav";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@prisma/client";

const CARD = "rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]";

/** Morning, afternoon or evening in Cairo, where the team works. */
function partOfDay() {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Cairo" }).format(new Date()));
  return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
}

/**
 * Super admin home, built around three questions in order: what is waiting
 * for me, what do I want to do, and how is the catalogue doing.
 */
export async function SuperAdminHome({ actor }: { actor: AdminActor }) {
  const t = await getTranslations("Admin.dashboard");
  const tQuick = await getTranslations("AdminAccess.quick");
  const locale = await getLocale();

  const applicationsByStatusQuery = prisma.application.groupBy({ by: ["status"], _count: { _all: true } });
  const [
    pendingChanges,
    newRequests,
    incomplete,
    drafts,
    universities,
    faculties,
    programs,
    programsPublished,
    students,
    applicationsByStatus,
    recentlyUpdated,
    recentUsers,
    recentLeads,
  ] = await prisma.$transaction([
    prisma.changeRequest.count({ where: { status: "PENDING" } }),
    prisma.partnerRequest.count({ where: { status: "NEW" } }),
    prisma.university.count({ where: UNIVERSITY_MISSING_CONTENT }),
    prisma.university.count({ where: { publishedAt: null } }),
    prisma.university.count(),
    prisma.faculty.count(),
    prisma.program.count(),
    prisma.program.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    applicationsByStatusQuery,
    prisma.university.findMany({
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 5,
      select: { id: true, name: true, nameAr: true, slug: true, city: true, cityAr: true, logoUrl: true, updatedAt: true },
    }),
    prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 5,
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    }),
    prisma.partnershipLead.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 5,
      select: { id: true, universityName: true, city: true, contactEmail: true, createdAt: true },
    }),
  ]);

  const byStatus = Object.fromEntries(Object.values(ApplicationStatus).map((status) => [status, 0])) as Record<ApplicationStatus, number>;
  for (const row of applicationsByStatus) byStatus[row.status] = row._count._all;
  const applicationsTotal = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
  const awaitingDecision = byStatus.SUBMITTED + byStatus.IN_REVIEW;

  // Only work that is actually waiting makes the list, most urgent first.
  const todo: { key: string; count: number; href: string; icon: LucideIcon; tone: string }[] = [
    { key: "changes", count: pendingChanges, href: "/admin/approvals", icon: ClipboardCheck, tone: "bg-[#FFF6E5] text-[#B77714]" },
    { key: "requests", count: newRequests, href: "/admin/requests", icon: Handshake, tone: "bg-[#EEF3FF] text-[#1E6DEB]" },
    { key: "applications", count: awaitingDecision, href: "/admin/applications?status=SUBMITTED", icon: FileText, tone: "bg-[#F1ECFF] text-[#6D4AE0]" },
    { key: "drafts", count: drafts, href: "/admin/universities?published=false", icon: FileClock, tone: "bg-slate-100 text-[#475569]" },
    { key: "incomplete", count: incomplete, href: "/admin/universities?content=missing", icon: ImageOff, tone: "bg-[#FFF0EE] text-[#C81F15]" },
  ].filter((item) => item.count > 0);

  const firstName = actor.name?.split(" ")[0] ?? "";
  const create = adminQuickActions(3).filter((action) =>
    ["addUniversity", "addFaculty", "addProgram", "bulkEdit", "addAdmin"].includes(action.key),
  );
  const glance = [
    { key: "universities", value: universities, href: "/admin/universities", icon: Building2 },
    { key: "faculties", value: faculties, href: "/admin/faculties", icon: Library },
    { key: "programs", value: programs, href: "/admin/programs", icon: GraduationCap, hint: t("glance.published", { count: formatNumber(locale, programsPublished) }) },
    { key: "students", value: students, href: "/admin/users", icon: Users },
  ];

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-8 md:py-8">
      {/* Greeting and the one thing most admins came to do: find a university. */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#0F172A]">
            {t(`greeting.${partOfDay()}`, { name: firstName })}
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            {todo.length ? t("summaryBusy") : t("summaryClear")}
          </p>
        </div>
        <form action={`/${locale}/admin/universities`} role="search" className="w-full lg:max-w-md">
          <label htmlFor="dashboard-find" className="sr-only">{t("find.label")}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="dashboard-find"
              name="q"
              type="search"
              autoComplete="off"
              placeholder={t("find.placeholder")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white ps-11 pe-24 text-[14.5px] text-[#0F172A] shadow-[0_1px_2px_rgba(16,24,40,0.05)] placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            />
            <button type="submit" className="absolute end-1.5 top-1/2 h-9 -translate-y-1/2 rounded-lg bg-[#1E6DEB] px-4 text-[13px] font-semibold text-white hover:bg-[#1859c4]">
              {t("find.submit")}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* What is waiting */}
        <section aria-labelledby="todo-heading" className={CARD}>
          <header className="px-5 pt-5 pb-3">
            <h2 id="todo-heading" className="text-[16px] font-semibold text-[#0F172A]">{t("todo.title")}</h2>
          </header>
          {todo.length ? (
            <ul className="space-y-2 px-3 pb-3">
              {todo.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                  >
                    <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", item.tone)}>
                      <item.icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-semibold text-[#0F172A]">{t(`todo.${item.key}.title`)}</span>
                      <span className="block text-[12.5px] text-[#64748B]">{t(`todo.${item.key}.body`)}</span>
                    </span>
                    <span className="shrink-0 text-[22px] font-semibold tabular-nums text-[#0F172A]">{formatNumber(locale, item.count)}</span>
                    <span className="hidden shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-semibold text-[#1E6DEB] transition-colors group-hover:border-[#1E6DEB]/40 group-hover:bg-white sm:inline-flex">
                      {t(`todo.${item.key}.action`)}
                      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-6 pt-4 pb-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#E7F6EE] text-[#0F7B45]">
                <CheckCircle2 className="size-7" aria-hidden />
              </span>
              <p className="mt-3 text-[15px] font-semibold text-[#0F172A]">{t("todo.clearTitle")}</p>
              <p className="mt-1 max-w-sm text-[13px] text-[#64748B]">{t("todo.clearBody")}</p>
            </div>
          )}
        </section>

        {/* What to start */}
        <section aria-labelledby="create-heading" className={CARD}>
          <header className="px-5 pt-5 pb-2">
            <h2 id="create-heading" className="text-[16px] font-semibold text-[#0F172A]">{t("create.title")}</h2>
          </header>
          <ul className="px-2 pb-3">
            {create.map((action) => {
              const Icon = QUICK_ACTION_ICONS[action.key];
              return (
                <li key={action.key}>
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#1E6DEB]">
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-[#0F172A]">{tQuick(`items.${action.key}.title`)}</span>
                      <span className="block truncate text-[12px] text-[#64748B]">{tQuick(`items.${action.key}.description`)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* How the catalogue is doing: every figure opens its list. */}
      <section aria-labelledby="glance-heading" className="mt-8">
        <h2 id="glance-heading" className="text-[16px] font-semibold text-[#0F172A]">{t("glance.title")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {glance.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(CARD, "group flex flex-col gap-3 p-5 transition-colors hover:border-[#1E6DEB]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]")}
            >
              <span className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#64748B]">{t(`glance.${item.key}`)}</span>
                <item.icon className="size-[18px] text-[#94A3B8] group-hover:text-[#1E6DEB]" aria-hidden />
              </span>
              <span className="text-[28px] leading-none font-semibold tabular-nums tracking-[-0.02em] text-[#0F172A]">
                {formatNumber(locale, item.value)}
              </span>
              {item.hint ? <span className="text-[12px] text-[#64748B]">{item.hint}</span> : null}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="recent-heading" className={CARD}>
          <header className="flex items-center justify-between gap-3 px-5 pt-5 pb-2">
            <div>
              <h2 id="recent-heading" className="text-[16px] font-semibold text-[#0F172A]">{t("recent.title")}</h2>
              <p className="text-[12.5px] text-[#64748B]">{t("recent.subtitle")}</p>
            </div>
            <Link href="/admin/universities" className="shrink-0 text-[13px] font-semibold text-[#1E6DEB] hover:underline">
              {t("recent.all")}
            </Link>
          </header>
          <ul className="px-2 pb-3">
            {recentlyUpdated.map((university) => (
              <li key={university.id}>
                <Link
                  href={`/admin/universities/${university.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                >
                  {university.logoUrl ? (
                    // Logos are local files or uploads; small enough for a plain img.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={university.logoUrl} alt="" className="size-9 shrink-0 rounded-lg border border-slate-100 bg-white object-contain p-0.5" />
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <Building2 className="size-4" aria-hidden />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-[#0F172A]">
                      {locale === "ar" ? (university.nameAr ?? university.name) : university.name}
                    </span>
                    <span className="block truncate text-[12px] text-[#64748B]">
                      {locale === "ar" ? (university.cityAr ?? university.city) : university.city}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] text-[#94A3B8]">
                    <RelativeDate value={university.updatedAt} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <RecentUsers rows={recentUsers} />
      </div>

      {/* Applications are not open to students yet; the pipeline appears once they are. */}
      {applicationsTotal > 0 ? (
        <div className="mt-8">
          <PipelineStrip counts={byStatus} total={applicationsTotal} />
        </div>
      ) : null}

      {recentLeads.length ? (
        <div className="mt-8">
          <RecentLeads rows={recentLeads} />
        </div>
      ) : null}
    </div>
  );
}
