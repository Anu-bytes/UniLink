import { ApplicationStatus } from "@prisma/client";
import { Building2, FileText, GraduationCap, Users } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, StatCard, StatCardGrid } from "@/components/admin";
import { PipelineStrip } from "@/components/admin/overview/pipeline-strip";
import { RecentApplications } from "@/components/admin/overview/recent-applications";
import { RecentLeads } from "@/components/admin/overview/recent-leads";
import { RecentUsers } from "@/components/admin/overview/recent-users";
import { SecondaryStats } from "@/components/admin/overview/secondary-stats";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const t = await getTranslations("Admin.overview");
  const locale = await getLocale();

  // One instant for every "last 30 days" figure, so the two trends are
  // measured against the same cut rather than drifting apart as the queries
  // run. Stepped in UTC to match /api/admin/stats, which measures the same
  // window from the same wall clock.
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);

  // Hoisted out of the array below on purpose: inside a $transaction literal
  // Prisma stops narrowing groupBy's return type and `_count._all` disappears.
  // The promise is lazy, so the query still runs as part of the batch.
  const applicationsByStatusQuery = prisma.application.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  // Every figure on this page goes out as one batched $transaction — one call
  // into the query engine and one connection held, rather than seventeen taken
  // from the pool in sequence. This mirrors /api/admin/stats, which assembles
  // the same shape; a server component fetching its own API route would be an
  // HTTP round trip back into this process for numbers it can read directly.
  const [
    universitiesTotal,
    universitiesPublished,
    programsTotal,
    programsPublished,
    students,
    studentProfiles,
    usersNewLast30Days,
    applicationsTotal,
    applicationsByStatus,
    faculties,
    scholarships,
    testimonials,
    savedFaculties,
    leadsNewLast30Days,
    recentApplications,
    recentUsers,
    recentLeads,
  ] = await prisma.$transaction([
    prisma.university.count(),
    prisma.university.count({ where: { publishedAt: { not: null } } }),
    prisma.program.count(),
    prisma.program.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.studentProfile.count(),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.application.count(),
    applicationsByStatusQuery,
    prisma.faculty.count(),
    prisma.scholarship.count(),
    prisma.testimonial.count(),
    prisma.savedFaculty.count(),
    prisma.partnershipLead.count({ where: { createdAt: { gte: since } } }),
    // The id tiebreaker matters more here than on a paginated list: seeded
    // rows share a createdAt to the millisecond, and without it the five
    // "newest" rows reshuffle between renders.
    prisma.application.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
        program: {
          select: {
            name: true,
            nameAr: true,
            university: { select: { name: true, nameAr: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.partnershipLead.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 5,
      select: {
        id: true,
        universityName: true,
        city: true,
        contactEmail: true,
        createdAt: true,
      },
    }),
  ]);

  // groupBy only returns statuses that have rows, so a status nobody has
  // reached yet would be missing entirely and its tile would render blank
  // instead of "0". Seeding from the generated enum rather than a hand-written
  // list means a status added to the schema cannot be forgotten here.
  const byStatus = Object.fromEntries(
    Object.values(ApplicationStatus).map((status) => [status, 0]),
  ) as Record<ApplicationStatus, number>;

  for (const row of applicationsByStatus) {
    byStatus[row.status] = row._count._all;
  }

  const awaitingReview = byStatus.SUBMITTED + byStatus.IN_REVIEW;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="mt-6 flex flex-col gap-6">
        <StatCardGrid>
          <StatCard
            label={t("stats.universities")}
            value={formatNumber(locale, universitiesTotal)}
            hint={t("stats.universitiesHint", {
              count: formatNumber(locale, universitiesPublished),
            })}
            icon={Building2}
          />
          <StatCard
            label={t("stats.programs")}
            value={formatNumber(locale, programsTotal)}
            hint={t("stats.programsHint", {
              count: formatNumber(locale, programsPublished),
            })}
            icon={GraduationCap}
          />
          <StatCard
            label={t("stats.students")}
            value={formatNumber(locale, students)}
            hint={t("stats.studentsHint", {
              count: formatNumber(locale, studentProfiles),
            })}
            icon={Users}
          />
          <StatCard
            label={t("stats.applications")}
            value={formatNumber(locale, applicationsTotal)}
            hint={t("stats.applicationsHint", {
              count: formatNumber(locale, awaitingReview),
            })}
            icon={FileText}
            tone={awaitingReview > 0 ? "warning" : "default"}
          />
        </StatCardGrid>

        <PipelineStrip counts={byStatus} total={applicationsTotal} />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentApplications rows={recentApplications} />
          <RecentUsers rows={recentUsers} />
        </div>

        <RecentLeads rows={recentLeads} />

        <SecondaryStats
          faculties={faculties}
          scholarships={scholarships}
          testimonials={testimonials}
          savedFaculties={savedFaculties}
          newUsers={usersNewLast30Days}
          newLeads={leadsNewLast30Days}
        />
      </div>
    </div>
  );
}
