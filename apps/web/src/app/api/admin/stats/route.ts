import { ApplicationStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  // Built once and reused by every "last 30 days" figure below, so the user,
  // application and lead trends are all measured against the same instant
  // rather than drifting apart as the queries run.
  const since = new Date(Date.now() - THIRTY_DAYS_MS);

  // Written out on its own rather than inlined into the array below: inside a
  // $transaction literal Prisma stops narrowing groupBy's return type and
  // `_count._all` disappears. The promise is lazy, so the query still runs as
  // part of the batch.
  const applicationsByStatusQuery = prisma.application.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  // The overview page renders all of these at once, so they go out as one
  // batched $transaction: one call into the query engine instead of two dozen
  // awaits, and one connection held rather than twenty-four taken from the
  // pool in sequence. Note that this is READ COMMITTED like every other
  // transaction here, so the figures are not a single snapshot — a row written
  // mid-request can leave a total a hair out of step with the breakdown below.
  // That is fine for an overview and not worth an isolation level nobody else
  // in this codebase asks for.
  const [
    universitiesTotal,
    universitiesPublished,
    universitiesFeatured,
    facultiesTotal,
    programsTotal,
    programsPublished,
    usersTotal,
    usersStudents,
    usersParents,
    usersPartners,
    usersAdmins,
    usersWithProfile,
    usersNewLast30Days,
    applicationsTotal,
    applicationsByStatus,
    applicationsSubmittedLast30Days,
    leadsTotal,
    leadsNewLast30Days,
    savedFaculties,
    savedPrograms,
    testimonials,
    scholarships,
    recentApplications,
    recentUsers,
    recentLeads,
  ] = await prisma.$transaction([
    prisma.university.count(),
    prisma.university.count({ where: { publishedAt: { not: null } } }),
    prisma.university.count({ where: { isFeatured: true } }),
    prisma.faculty.count(),
    prisma.program.count(),
    prisma.program.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "PARENT" } }),
    prisma.user.count({ where: { role: "PARTNER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.studentProfile.count(),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.application.count(),
    applicationsByStatusQuery,
    prisma.application.count({ where: { submittedAt: { gte: since } } }),
    prisma.partnershipLead.count(),
    prisma.partnershipLead.count({ where: { createdAt: { gte: since } } }),
    prisma.savedFaculty.count(),
    prisma.savedProgram.count(),
    prisma.testimonial.count(),
    prisma.scholarship.count(),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, image: true } },
        program: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            university: { select: { id: true, name: true, nameAr: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "desc" },
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

  // groupBy only returns the statuses that actually have rows, so a status
  // nobody has reached yet would be missing from the object entirely and its
  // tile would render blank instead of "0". Seed every key from the enum —
  // reading it off the generated client rather than a hand-written list means
  // a new status added to the schema cannot be forgotten here.
  const byStatus = Object.fromEntries(
    Object.values(ApplicationStatus).map((status) => [status, 0]),
  ) as Record<ApplicationStatus, number>;

  for (const row of applicationsByStatus) {
    byStatus[row.status] = row._count._all;
  }

  return NextResponse.json({
    universities: {
      total: universitiesTotal,
      published: universitiesPublished,
      featured: universitiesFeatured,
    },
    faculties: { total: facultiesTotal },
    programs: { total: programsTotal, published: programsPublished },
    // Every UserRole is broken out, PARTNER included, so the role tiles sum to
    // `total`. Omitting one leaves an unexplained remainder on the overview.
    users: {
      total: usersTotal,
      students: usersStudents,
      parents: usersParents,
      partners: usersPartners,
      admins: usersAdmins,
      withProfile: usersWithProfile,
      newLast30Days: usersNewLast30Days,
    },
    applications: {
      total: applicationsTotal,
      byStatus,
      submittedLast30Days: applicationsSubmittedLast30Days,
    },
    leads: { total: leadsTotal, newLast30Days: leadsNewLast30Days },
    engagement: {
      savedFaculties,
      savedPrograms,
      testimonials,
      scholarships,
    },
    recent: {
      applications: recentApplications,
      users: recentUsers,
      leads: recentLeads,
    },
  });
}
