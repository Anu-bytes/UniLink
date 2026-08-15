import { Target } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { FacultyCard } from "@/components/app/faculty-card";
import type { FacultyResult } from "@/lib/faculty-search";

/**
 * The bordered "Recommended for you" block above the general results, ordered
 * by the match score computed from the student's onboarding profile.
 *
 * Recommends faculties, matching the search results below it: the faculty is
 * the unit students choose, and its programs live on its own page.
 */
export async function RecommendedPanel({
  faculties,
  hasProfile,
}: {
  faculties: FacultyResult[];
  hasProfile: boolean;
}) {
  const t = await getTranslations("Search");
  const tProfile = await getTranslations("AppProfile");

  if (faculties.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-xl border-2 border-[#1E6DEB]/25 bg-white p-4 md:p-5">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F82C1F] via-[#1E6DEB] to-[#1E6DEB]" />

      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFF0EE] px-2 py-1 text-xs font-bold text-[#F82C1F]">
        <span className="ul-blink-warm inline-flex size-1.5 rounded-full bg-[#F82C1F]" />
        {t("recommendedBadge")}
      </span>

      <div className="mt-3 flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white"
        >
          <Target className="size-5" />
        </span>
        <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
          {t("recommendedTitle")}
        </h2>
      </div>

      <p className="mt-2 text-sm text-[#5a6072]">
        {hasProfile ? (
          t("recommendedSubtitle")
        ) : (
          <>
            {t("recommendedNoProfile")}{" "}
            <Link
              href="/app/profile"
              className="font-semibold text-[#1E6DEB] hover:underline"
            >
              {tProfile("completeProfile")}
            </Link>
          </>
        )}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {faculties.map((faculty) => (
          <FacultyCard key={faculty.id} faculty={faculty} />
        ))}
      </div>
    </section>
  );
}
