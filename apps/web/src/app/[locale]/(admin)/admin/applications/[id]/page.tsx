import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, PageHeader } from "@/components/admin";
import { ApplicantPanel } from "@/components/admin/applications/applicant-panel";
import { ApplicationReviewForm } from "@/components/admin/applications/application-review-form";
import { ProgramPanel } from "@/components/admin/applications/program-panel";
import { PAGE_WRAPPER } from "@/components/admin/applications/styles";
import { TimelinePanel } from "@/components/admin/applications/timeline-panel";
import {
  APPLICATION_STATUS_TONES,
  applicantLabel,
} from "@/components/admin/applications/types";
import { localized } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export default async function AdminApplicationPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Admin");
  const tStatus = await getTranslations("Applications.status");
  const locale = await getLocale();

  const application = await prisma.application.findUnique({
    where: { id },
    // Never the student's `passwordHash`: reviewing an application means
    // reading the profile behind it, never the credential. Leaving it out of
    // the select rather than stripping it later means a careless edit here
    // cannot put it back on the wire.
    select: {
      id: true,
      status: true,
      notes: true,
      createdAt: true,
      submittedAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      program: {
        select: {
          id: true,
          name: true,
          nameAr: true,
          studyLevel: true,
          university: { select: { id: true, name: true, nameAr: true } },
        },
      },
    },
  });

  if (!application) notFound();

  const label = applicantLabel(application.user);

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={label}
        breadcrumb={[
          { href: "/admin/applications", label: t("applications.title") },
          { label },
        ]}
        description={`${localized(
          locale,
          application.program.name,
          application.program.nameAr,
        )} · ${localized(
          locale,
          application.program.university.name,
          application.program.university.nameAr,
        )}`}
        actions={
          <Badge tone={APPLICATION_STATUS_TONES[application.status]} dot>
            {tStatus(application.status)}
          </Badge>
        }
      />

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <ApplicantPanel user={application.user} />
          <ProgramPanel program={application.program} />
          <TimelinePanel
            createdAt={application.createdAt}
            submittedAt={application.submittedAt}
            updatedAt={application.updatedAt}
          />
        </div>

        <ApplicationReviewForm
          id={application.id}
          status={application.status}
          notes={application.notes}
        />
      </div>
    </div>
  );
}
