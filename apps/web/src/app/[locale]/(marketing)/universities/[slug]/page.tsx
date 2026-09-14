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
import { TabGallery } from "@/components/university/tab-gallery";
import { TabLocation } from "@/components/university/tab-location";
import {
  getUniversityDetail,
  incrementUniversityViews,
  type UniversityDetailData,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ tab?: string }>;
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
  const { tab } = await searchParams;
  const locale = await getLocale();

  const [university, session] = await Promise.all([
    getUniversityDetail(locale, slug),
    auth(),
  ]);
  if (!university) notFound();

  const active: UniversityTab = isUniversityTab(tab) ? tab : "faculties";
  const isAuthenticated = Boolean(session?.user?.id);

  // Counts pages read, not tab switches, so only the default tab increments.
  //
  // Deferred with `after` so the write happens once the response has been sent.
  // As a floating promise it was both delaying nothing usefully and liable to
  // be cut short when the serverless invocation ended.
  if (active === "faculties") {
    after(() => incrementUniversityViews(university.id));
  }

  const callbackUrl = `/universities/${university.slug}${active === "faculties" ? "" : `?tab=${active}`}`;
  const panel = (
    <TabPanel
      tab={active}
      university={university}
      isAuthenticated={isAuthenticated}
      callbackUrl={callbackUrl}
    />
  );

  return (
    <>
      <UniversityHero university={university} />

      {/* Anchored so links elsewhere on the page (the hero's "Explore
          programs" CTA) can jump straight to the tab content instead of
          just swapping it in off-screen below a tall hero. */}
      <section id="tabs" className="mx-auto max-w-7xl scroll-mt-6 px-4 pb-16 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <UniversityTabs slug={university.slug} active={active} />

          <div className="p-5 md:p-8">{panel}</div>
        </div>
      </section>
    </>
  );
}

function TabPanel({
  tab,
  university,
  isAuthenticated,
  callbackUrl,
}: {
  tab: UniversityTab;
  university: UniversityDetailData;
  isAuthenticated: boolean;
  callbackUrl: string;
}) {
  switch (tab) {
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
        />
      );
  }
}
