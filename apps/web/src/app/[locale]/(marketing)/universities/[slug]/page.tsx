import type { Metadata } from "next";
import { after } from "next/server";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { auth } from "@/auth";
import { UniversityHero } from "@/components/university/university-hero";
import {
  UniversityTabs,
  isUniversityTab,
  type UniversityTab,
} from "@/components/university/university-tabs";
import { TabFaculties } from "@/components/university/tab-faculties";
import { TabMinimumScores } from "@/components/university/tab-minimum-scores";
import { certificateGroupFor, type CertificateGroup } from "@/lib/admission-limits";
import { prisma } from "@/lib/prisma";
import { getRatingSummary } from "@/lib/university-ratings";
import { canEditUniversity, getAdminActor } from "@/lib/admin";
import { ProfileEditor, type EditableUniversity } from "@/components/university/profile-editor";
import { TabGallery } from "@/components/university/tab-gallery";
import { TabLocation } from "@/components/university/tab-location";
import {
  getUniversityDetail,
  incrementUniversityViews,
  isUniversitySaved,
  type UniversityDetailData,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ tab?: string; edit?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const university = await getUniversityDetail(locale, slug);

  if (!university) return {};

  return {
    title: `${university.name} | UniLink`,
    description: university.description ?? undefined,
    openGraph: {
      title: university.name,
      description: university.description ?? undefined,
      images: university.coverImageUrl ? [university.coverImageUrl] : undefined,
    },
  };
}

export default async function UniversityDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { tab, edit } = await searchParams;
  const locale = await getLocale();

  const [university, session] = await Promise.all([
    getUniversityDetail(locale, slug),
    auth(),
  ]);
  if (!university) notFound();

  const active: UniversityTab = isUniversityTab(tab) ? tab : "faculties";
  const isAuthenticated = Boolean(session?.user?.id);
  const [isLiked, ratingSummary] = await Promise.all([
    isUniversitySaved(session?.user?.id ?? null, university.id),
    getRatingSummary(university.id, session?.user?.id ?? null),
  ]);

  // Counts pages read, not tab switches, so only the default tab increments.
  //
  // Deferred with `after` so the write happens once the response has been sent.
  // As a floating promise it was both delaying nothing usefully and liable to
  // be cut short when the serverless invocation ended.
  if (active === "faculties") {
    after(() => incrementUniversityViews(university.id));
  }

  // The signed-in student's certificate, so the scores tab can point at
  // their column. Only read on that tab.
  const certificateGroup =
    active === "scores" && session?.user?.id
      ? certificateGroupFor(
          (
            await prisma.studentProfile.findUnique({
              where: { userId: session.user.id },
              select: { highSchoolSystem: true },
            })
          )?.highSchoolSystem,
        )
      : null;

  // Admins who may edit this university get the on-page editor. Read fresh
  // (not the cached detail) so they always edit the current values.
  const actor = isAuthenticated ? await getAdminActor() : null;
  const canEdit = actor ? canEditUniversity(actor, university.id) : false;
  const editable = canEdit ? await loadEditable(university.id) : null;
  const myPending =
    canEdit && actor?.level === 1
      ? await prisma.changeRequest.count({ where: { universityId: university.id, authorId: actor.id, status: "PENDING" } })
      : 0;

  const callbackUrl = `/universities/${university.slug}${active === "faculties" ? "" : `?tab=${active}`}`;
  const panel = (
    <TabPanel
      tab={active}
      university={university}
      isAuthenticated={isAuthenticated}
      callbackUrl={callbackUrl}
      certificateGroup={certificateGroup}
      canEdit={canEdit}
    />
  );

  return (
    <>
      <UniversityHero
        university={university}
        isAuthenticated={isAuthenticated}
        isLiked={isLiked}
        ratingSummary={ratingSummary}
      />

      {/* Anchored so links (?tab=...#tabs) can jump straight to the tab
          content instead of just swapping it in off-screen below a tall
          hero. */}
      {/* On a phone the panel runs edge to edge (no card inside the page
          gutter), which gives the faculty list the full screen width instead
          of squeezing it inside two layers of padding. */}
      <section id="tabs" className="mx-auto max-w-7xl scroll-mt-20 pb-16 sm:px-4 md:px-6">
        <div className="overflow-hidden border-y border-slate-200/80 bg-white sm:rounded-3xl sm:border sm:shadow-sm">
          <UniversityTabs slug={university.slug} active={active} />

          <div className="px-4 py-5 sm:p-5 md:p-8">{panel}</div>
        </div>
      </section>

      {editable && actor ? (
        <ProfileEditor
          university={editable}
          mode={actor.level === 3 ? "direct" : "review"}
          pendingCount={myPending}
          startOpen={edit === "1"}
        />
      ) : null}
    </>
  );
}

async function loadEditable(id: string): Promise<EditableUniversity | null> {
  const row = await prisma.university.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      name: true,
      nameAr: true,
      acronym: true,
      type: true,
      city: true,
      cityAr: true,
      addressLine: true,
      addressLineAr: true,
      description: true,
      descriptionAr: true,
      establishedYear: true,
      websiteUrl: true,
      googleMapsUrl: true,
      logoUrl: true,
      coverImageUrl: true,
      images: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, url: true, alt: true } },
      faculties: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: {
          id: true,
          name: true,
          nameAr: true,
          programs: {
            orderBy: { name: "asc" },
            select: {
              id: true,
              name: true,
              nameAr: true,
              tuitionFee: true,
              tuitionPeriod: true,
              currency: true,
              minGradePercent: true,
              isPublished: true,
            },
          },
        },
      },
    },
  });
  if (!row) return null;
  return {
    ...row,
    faculties: row.faculties.map((faculty) => ({
      ...faculty,
      programs: faculty.programs.map((program) => ({
        ...program,
        tuitionFee: program.tuitionFee == null ? null : Number(program.tuitionFee),
      })),
    })),
  };
}

function TabPanel({
  tab,
  university,
  isAuthenticated,
  callbackUrl,
  certificateGroup,
  canEdit,
}: {
  tab: UniversityTab;
  university: UniversityDetailData;
  isAuthenticated: boolean;
  callbackUrl: string;
  certificateGroup: CertificateGroup | null;
  canEdit: boolean;
}) {
  switch (tab) {
    case "scores":
      return <TabMinimumScores university={university} highlight={certificateGroup} />;
    case "gallery":
      return <TabGallery university={university} />;
    case "location":
      return <TabLocation university={university} />;
    default:
      return (
        <TabFaculties
          university={university}
          isAuthenticated={isAuthenticated}
          callbackUrl={callbackUrl}
          canEdit={canEdit}
        />
      );
  }
}
