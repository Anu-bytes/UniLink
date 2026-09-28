import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { FacultyCard } from "@/components/app/faculty-card";
import { SavedTabs } from "@/components/app/saved-tabs";
import { UniversityResultCard } from "@/components/app/university-result-card";
import { getSavedFaculties } from "@/lib/faculty-search";
import { getSavedUniversities } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const t = await getTranslations("Saved");
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/login`);

  const [faculties, universities] = await Promise.all([
    getSavedFaculties(locale, session.user.id),
    getSavedUniversities(locale, session.user.id),
  ]);

  const hasAny = faculties.length > 0 || universities.length > 0;

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 pb-32 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm text-[#5a6072]">{t("subtitle")}</p>

      {hasAny ? (
        <SavedTabs
          facultyCount={faculties.length}
          universityCount={universities.length}
          allLabel={t("tabAll")}
          facultiesLabel={t("tabFaculties")}
          universitiesLabel={t("tabUniversities")}
          facultiesHeading={t("tabFaculties")}
          universitiesHeading={t("tabUniversities")}
          emptyTabLabel={t("emptyTab")}
          facultiesNode={faculties.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} />
          ))}
          universitiesNode={universities.map((university) => (
            <UniversityResultCard key={university.id} university={university} />
          ))}
        />
      ) : (
        <div className="mt-6 rounded-xl bg-[#F5F8FF] px-6 py-16 text-center">
          <Heart className="mx-auto size-8 text-[#98A0B4]" aria-hidden />
          <h2 className="mt-3 text-lg font-bold text-[#1F2A44]">
            {t("emptyTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
            {t("emptyBody")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app/search"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white hover:bg-[#1859c4]"
            >
              {t("browse")}
            </Link>
            <Link
              href="/app/search?mode=universities"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#F82C1F]/30 px-6 text-sm font-bold text-[#F82C1F] hover:bg-[#FFF0EE]"
            >
              {t("browseUniversities")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
