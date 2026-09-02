import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, PageHeader } from "@/components/admin";
import { ProgramDetailsForm } from "@/components/admin/programs/details-form";
import {
  ProgramEditorTabs,
  isProgramEditorTab,
} from "@/components/admin/programs/editor-tabs";
import { ProgramEnglishPanel } from "@/components/admin/programs/english-panel";
import { ProgramFeesPanel } from "@/components/admin/programs/fees-panel";
import { ProgramIntakesPanel } from "@/components/admin/programs/intakes-panel";
import { ProgramDeleteAction } from "@/components/admin/programs/program-delete-action";
import { PAGE_WRAPPER, SECONDARY_BUTTON } from "@/components/admin/programs/styles";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const { id } = await params;
  const sp = await searchParams;
  const t = await getTranslations("Admin");
  const locale = await getLocale();

  const rawTab = single(sp.tab);
  const tab = isProgramEditorTab(rawTab) ? rawTab : "details";

  const program = await prisma.program.findUnique({
    where: { id },
    select: {
      id: true,
      universityId: true,
      facultyId: true,
      name: true,
      nameAr: true,
      slug: true,
      description: true,
      descriptionAr: true,
      studyLevel: true,
      fieldOfStudy: true,
      durationMonths: true,
      durationLabel: true,
      durationLabelAr: true,
      tuitionFee: true,
      tuitionPeriod: true,
      currency: true,
      applicationFee: true,
      applicationFeeWaived: true,
      minGradePercent: true,
      coopAvailable: true,
      tags: true,
      isPublished: true,
      university: { select: { name: true, nameAr: true, slug: true } },
    },
  });

  if (!program) {
    notFound();
  }

  // Only the active tab's collection is read: the Details tab has no use for
  // the intakes, and vice versa.
  const faculties =
    tab === "details"
      ? await prisma.faculty.findMany({
          where: { universityId: program.universityId },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          select: { id: true, name: true, nameAr: true, universityId: true },
        })
      : [];

  const intakes =
    tab === "intakes"
      ? await prisma.programIntake.findMany({
          where: { programId: id },
          // Upcoming intakes first, the order the admission tab reads in.
          orderBy: [{ year: "desc" }, { season: "asc" }],
          select: { id: true, season: true, year: true, applicationDeadline: true },
        })
      : [];

  const requirements =
    tab === "english"
      ? await prisma.programEnglishRequirement.findMany({
          where: { programId: id },
          orderBy: [{ test: "asc" }, { id: "asc" }],
          select: { id: true, test: true, minScore: true },
        })
      : [];

  const universityLabel =
    locale === "ar"
      ? (program.university.nameAr ?? program.university.name)
      : program.university.name;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        breadcrumb={[
          { href: "/admin/programs", label: t("programs.title") },
          { label: program.name },
        ]}
        title={program.name}
        description={
          <Link
            href={`/admin/universities/${program.universityId}`}
            className="transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {universityLabel}
          </Link>
        }
        actions={
          <>
            {program.isPublished ? (
              <Badge tone="green" dot>
                {t("common.published")}
              </Badge>
            ) : (
              <Badge tone="neutral" dot>
                {t("common.draft")}
              </Badge>
            )}
            <Link
              href={`/universities/${program.university.slug}/programs/${program.slug}`}
              target="_blank"
              rel="noreferrer"
              className={SECONDARY_BUTTON}
            >
              <ExternalLink className="size-4" aria-hidden />
              {t("programs.viewPublic")}
            </Link>
            <ProgramDeleteAction
              program={{ id: program.id, name: program.name }}
              variant="button"
              after="list"
            />
          </>
        }
      />

      <div className="mt-6 space-y-5">
        <ProgramEditorTabs programId={program.id} active={tab} />

        {tab === "details" ? (
          <ProgramDetailsForm
            program={{
              id: program.id,
              universityId: program.universityId,
              facultyId: program.facultyId,
              name: program.name,
              nameAr: program.nameAr,
              slug: program.slug,
              description: program.description,
              descriptionAr: program.descriptionAr,
              studyLevel: program.studyLevel,
              fieldOfStudy: program.fieldOfStudy,
              durationMonths: program.durationMonths,
              durationLabel: program.durationLabel,
              durationLabelAr: program.durationLabelAr,
              minGradePercent: program.minGradePercent,
              coopAvailable: program.coopAvailable,
              tags: program.tags,
              isPublished: program.isPublished,
            }}
            universityLabel={universityLabel}
            faculties={faculties}
          />
        ) : null}

        {tab === "fees" ? (
          <ProgramFeesPanel
            programId={program.id}
            fees={{
              // Decimal cannot cross into a client component.
              tuitionFee:
                program.tuitionFee === null ? null : Number(program.tuitionFee),
              tuitionPeriod: program.tuitionPeriod,
              currency: program.currency,
              applicationFee:
                program.applicationFee === null ? null : Number(program.applicationFee),
              applicationFeeWaived: program.applicationFeeWaived,
            }}
          />
        ) : null}

        {tab === "intakes" ? (
          <ProgramIntakesPanel programId={program.id} intakes={intakes} />
        ) : null}

        {tab === "english" ? (
          <ProgramEnglishPanel programId={program.id} requirements={requirements} />
        ) : null}
      </div>
    </div>
  );
}
