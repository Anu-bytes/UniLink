import type { Metadata } from "next";
import { after } from "next/server";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { auth } from "@/auth";
import { NextIntlClientProvider } from "next-intl";
import { editorMessages } from "@/lib/client-messages";
import { UniversityHero } from "@/components/university/university-hero";
import {
  UNIVERSITY_TABS,
  UniversityTabs,
  isUniversityTab,
  type UniversityTab,
} from "@/components/university/university-tabs";
import { TabContentBlocks } from "@/components/university/tab-content-blocks";
import { TabFaculties } from "@/components/university/tab-faculties";
import { TabMinimumScores } from "@/components/university/tab-minimum-scores";
import { certificateGroupFor, type CertificateGroup } from "@/lib/admission-limits";
import { prisma } from "@/lib/prisma";
import { getRatingSummary } from "@/lib/university-ratings";
import { canEditUniversity, getAdminActor } from "@/lib/admin";
import { adminLevelOf } from "@/lib/admin-nav";
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
  const userId = session?.user?.id ?? null;
  const isAuthenticated = Boolean(userId);

  // Everything the page needs about the viewer, in one round of queries
  // rather than one after another (each is a trip to the database):
  //  - liked / own rating (the rating counts themselves are cached),
  //  - the certificate, on the scores tab, so it can point at their column,
  //  - the admin record, only when the session says admin at all: students
  //    and visitors never pay for it. The record is still read from the
  //    database, so a revoked admin loses the editor at once.
  const [isLiked, ratingSummary, studentProfile, actor] = await Promise.all([
    isUniversitySaved(userId, university.id),
    getRatingSummary(university.id, userId),
    active === "scores" && userId
      ? prisma.studentProfile.findUnique({ where: { userId }, select: { highSchoolSystem: true } })
      : null,
    adminLevelOf(session?.user?.role) ? getAdminActor() : null,
  ]);
  const certificateGroup = active === "scores" && userId ? certificateGroupFor(studentProfile?.highSchoolSystem) : null;

  // Counts pages read, not tab switches, so only the default tab increments.
  //
  // Deferred with `after` so the write happens once the response has been sent.
  // As a floating promise it was both delaying nothing usefully and liable to
  // be cut short when the serverless invocation ended.
  if (active === "faculties") {
    after(() => incrementUniversityViews(university.id));
  }

  // Admins who may edit this university get the on-page editor. Read fresh
  // (not the cached detail) so they always edit the current values.
  const canEdit = actor ? canEditUniversity(actor, university.id) : false;
  const [editable, myPending] = canEdit
    ? await Promise.all([
        loadEditable(university.id),
        actor?.level === 1
          ? prisma.changeRequest.count({ where: { universityId: university.id, authorId: actor.id, status: "PENDING" } })
          : 0,
      ])
    : [null, 0];

  // "More info" only appears once the profile has sections, except for its
  // editors, who need it to add the first one.
  const tabs = UNIVERSITY_TABS.filter(
    (entry) => entry !== "info" || (university.sections?.length ?? 0) > 0 || canEdit || active === "info",
  );

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

      {/* The editor's text (and the edit buttons inside the tabs) only reaches
          the browser for someone who can edit this university. */}
      <EditorMessages enabled={Boolean(editable && actor)}>
        {/* Anchored so links (?tab=...#tabs) can jump straight to the tab
            content instead of just swapping it in off-screen below a tall
            hero. */}
        {/* On a phone the panel runs edge to edge (no card inside the page
            gutter), which gives the faculty list the full screen width instead
            of squeezing it inside two layers of padding. */}
        <section id="tabs" className="mx-auto max-w-7xl scroll-mt-20 pb-16 sm:px-4 md:px-6">
          <div className="overflow-hidden border-y border-slate-200/80 bg-white sm:rounded-3xl sm:border sm:shadow-sm">
            <UniversityTabs slug={university.slug} active={active} tabs={tabs} />

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
      </EditorMessages>
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
      contentBlocks: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, section: true, title: true, titleAr: true, body: true, bodyAr: true, sortOrder: true },
      },
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
    case "info":
      return <TabContentBlocks sections={university.sections ?? []} canEdit={canEdit} />;
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

async function EditorMessages({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  if (!enabled) return children;
  return <NextIntlClientProvider messages={await editorMessages()}>{children}</NextIntlClientProvider>;
}
