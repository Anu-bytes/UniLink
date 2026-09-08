import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Badge, PageHeader } from "@/components/admin";
import { ContentPanel } from "@/components/admin/universities/content-panel";
import { UniversityDetailsForm } from "@/components/admin/universities/details-form";
import {
  UniversityEditorTabs,
  isUniversityEditorTab,
} from "@/components/admin/universities/editor-tabs";
import { FeaturesPanel } from "@/components/admin/universities/features-panel";
import { MediaPanel } from "@/components/admin/universities/media-panel";
import { ScoresPanel } from "@/components/admin/universities/scores-panel";
import {
  PAGE_WRAPPER,
  SECONDARY_BUTTON,
} from "@/components/admin/universities/styles";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditUniversityPage({
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

  const rawTab = firstParam(sp.tab);
  const tab = isUniversityEditorTab(rawTab) ? rawTab : "details";

  const university = await prisma.university.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      nameAr: true,
      slug: true,
      type: true,
      country: true,
      countryAr: true,
      city: true,
      cityAr: true,
      description: true,
      descriptionAr: true,
      aboutRich: true,
      aboutRichAr: true,
      websiteUrl: true,
      logoUrl: true,
      coverImageUrl: true,
      establishedYear: true,
      addressLine: true,
      addressLineAr: true,
      phone: true,
      email: true,
      isFeatured: true,
      isRecommended: true,
      isTrending: true,
      latitude: true,
      longitude: true,
      publishedAt: true,
    },
  });

  if (!university) {
    notFound();
  }

  // Only the active tab's collection is read: a university with a long gallery
  // and a hundred cut-offs would otherwise pay for all four on every tab.
  const images =
    tab === "media"
      ? await prisma.universityImage.findMany({
          where: { universityId: id },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        })
      : [];

  const features =
    tab === "features"
      ? await prisma.universityFeature.findMany({
          where: { universityId: id },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        })
      : [];

  const blocks =
    tab === "content"
      ? await prisma.universityContentBlock.findMany({
          where: { universityId: id },
          orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
        })
      : [];

  const scoresTab =
    tab === "scores"
      ? await prisma.$transaction([
          prisma.minimumScore.findMany({
            where: { universityId: id },
            // University-wide cut-offs read first inside each system; Postgres
            // sorts NULLs last, so they have to be asked for explicitly.
            orderBy: [
              { system: "asc" },
              { facultyId: { sort: "asc", nulls: "first" } },
              { id: "asc" },
            ],
          }),
          prisma.faculty.findMany({
            where: { universityId: id },
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            select: { id: true, name: true, nameAr: true },
          }),
        ])
      : null;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        breadcrumb={[
          { href: "/admin/universities", label: t("universities.title") },
          { label: university.name },
        ]}
        title={university.name}
        description={university.nameAr ?? undefined}
        actions={
          <>
            {university.publishedAt ? (
              <Badge tone="green" dot>
                {t("common.published")}
              </Badge>
            ) : (
              <Badge tone="neutral" dot>
                {t("common.draft")}
              </Badge>
            )}
            <Link
              href={`/universities/${university.slug}`}
              target="_blank"
              rel="noreferrer"
              className={SECONDARY_BUTTON}
            >
              <ExternalLink className="size-4" aria-hidden />
              {t("universities.viewPublic")}
            </Link>
          </>
        }
      />

      <div className="mt-6 space-y-5">
        <UniversityEditorTabs universityId={university.id} active={tab} />

        {tab === "details" ? (
          <UniversityDetailsForm university={university} />
        ) : null}

        {tab === "media" ? (
          <MediaPanel
            universityId={university.id}
            logoUrl={university.logoUrl}
            coverImageUrl={university.coverImageUrl}
            images={images}
          />
        ) : null}

        {tab === "features" ? (
          <FeaturesPanel universityId={university.id} features={features} />
        ) : null}

        {tab === "content" ? (
          <ContentPanel universityId={university.id} blocks={blocks} />
        ) : null}

        {tab === "scores" ? (
          <ScoresPanel
            universityId={university.id}
            // Decimal cannot cross into a client component.
            scores={(scoresTab?.[0] ?? []).map((score) => ({
              ...score,
              minScore: Number(score.minScore),
            }))}
            faculties={scoresTab?.[1] ?? []}
          />
        ) : null}
      </div>
    </div>
  );
}
