import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { AccountCard, displayName } from "@/components/admin/users/account-card";
import { ActivityCard } from "@/components/admin/users/activity-card";
import { ProfileCard } from "@/components/admin/users/profile-card";
import { PAGE_WRAPPER } from "@/components/admin/users/styles";
import {
  lockFor,
  type UserApplicationRow,
} from "@/components/admin/users/types";
import { UserDeleteAction } from "@/components/admin/users/user-delete-action";
import { getAdminActor } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/**
 * One screenful of the account's applications. The card links out to the
 * filtered board for the rest rather than paginating a read-only aside.
 */
const APPLICATIONS_SHOWN = 10;

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const t = await getTranslations("Admin.users");
  const { id } = await params;

  // The layout has already 404'd anyone who is not an admin; this call is only
  // here to recognise the reader's own account.
  const actor = await getAdminActor();

  const [user, adminCount, withPassword] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id },
      // Never `passwordHash`. It is left out of the select rather than
      // stripped afterwards, so a later edit cannot put it back on the wire.
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        studentProfile: {
          select: {
            studyLevel: true,
            highSchoolSystem: true,
            highSchoolSystemOther: true,
            graduationYear: true,
            gradeValue: true,
            fieldsOfStudy: true,
            englishTest: true,
            englishScore: true,
            nationality: true,
            intakeSeason: true,
            intakeYear: true,
            budgetBand: true,
          },
        },
        applications: {
          orderBy: [{ createdAt: "desc" }, { id: "asc" }],
          take: APPLICATIONS_SHOWN,
          select: {
            id: true,
            status: true,
            createdAt: true,
            submittedAt: true,
            program: {
              select: {
                name: true,
                nameAr: true,
                university: { select: { name: true, nameAr: true } },
              },
            },
          },
        },
        // savedPrograms is counted because the delete dialog quotes it back
        // from the API's 409 — showing a figure there that appears nowhere on
        // the page reads as a number the admin has no way to check.
        _count: {
          select: { applications: true, savedFaculties: true, savedPrograms: true },
        },
      },
    }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    // "Has a password" as a count rather than a column: the hash never needs
    // to be read into this process to answer the only question the screen
    // asks of it, and a count cannot be forwarded to the client by accident.
    prisma.user.count({ where: { id, passwordHash: { not: null } } }),
  ]);

  if (!user) notFound();

  const applications: UserApplicationRow[] = user.applications.map(
    (application) => ({
      id: application.id,
      status: application.status,
      createdAt: application.createdAt,
      submittedAt: application.submittedAt,
      programName: application.program.name,
      programNameAr: application.program.nameAr,
      universityName: application.program.university.name,
      universityNameAr: application.program.university.nameAr,
    }),
  );

  const account = {
    id: user.id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
  };

  const label = displayName(account) ?? user.email;
  const lock = lockFor(user, actor?.id ?? "", adminCount);

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={label}
        breadcrumb={[{ href: "/admin/users", label: t("title") }, { label }]}
        description={<span dir="ltr">{user.email}</span>}
        actions={
          <UserDeleteAction
            user={{ id: user.id, name: user.name, email: user.email }}
            lock={lock}
            variant="button"
            after="list"
          />
        }
      />

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <ProfileCard profile={user.studentProfile} />

          <ActivityCard
            email={user.email}
            applications={applications}
            applicationCount={user._count.applications}
            savedFacultyCount={user._count.savedFaculties}
            savedProgramCount={user._count.savedPrograms}
          />
        </div>

        <AccountCard
          user={account}
          hasPassword={withPassword > 0}
          lock={lock}
        />
      </div>
    </div>
  );
}
