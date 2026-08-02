import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { UniversityHero } from "@/components/university/university-hero";
import {
  UniversityTabs,
  isUniversityTab,
  type UniversityTab,
} from "@/components/university/university-tabs";
import { TabAbout } from "@/components/university/tab-about";
import { TabContentBlocks } from "@/components/university/tab-content-blocks";
import { TabFaculties } from "@/components/university/tab-faculties";
import { TabLocation } from "@/components/university/tab-location";
import { TabMinimumScores } from "@/components/university/tab-minimum-scores";
import { TabTuition } from "@/components/university/tab-tuition";
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

  const university = await getUniversityDetail(locale, slug);
  if (!university) notFound();

  const active: UniversityTab = isUniversityTab(tab) ? tab : "about";

  // Counts pages read, not tab switches, so only the default tab increments.
  if (active === "about") {
    void incrementUniversityViews(university.id);
  }

  return (
    <>
      <UniversityHero university={university} />

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <UniversityTabs slug={university.slug} active={active} />

          <div className="p-5 md:p-8">
            <TabPanel tab={active} university={university} />
          </div>
        </div>
      </section>
    </>
  );
}

function TabPanel({
  tab,
  university,
}: {
  tab: UniversityTab;
  university: UniversityDetailData;
}) {
  switch (tab) {
    case "faculties":
      return <TabFaculties university={university} />;
    case "location":
      return <TabLocation university={university} />;
    case "requirements":
      return <TabContentBlocks blocks={university.admissionRequirements} />;
    case "criteria":
      return <TabContentBlocks blocks={university.admissionCriteria} />;
    case "scores":
      return <TabMinimumScores university={university} />;
    case "tuition":
      return <TabTuition university={university} />;
    default:
      return <TabAbout university={university} />;
  }
}
