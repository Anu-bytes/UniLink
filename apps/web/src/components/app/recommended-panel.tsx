import { ChevronDown, Target } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { RecommendedFacultyCard } from "@/components/app/recommended-faculty-card";
import type { FacultyResult } from "@/lib/faculty-search";

/**
 * The "Recommended for you" block above the general results, ordered by the
 * match score computed from the student's onboarding profile.
 *
 * Gold/amber throughout (border, badge, cards) instead of the search
 * results' blue, so it reads as a distinct lane rather than blending into
 * the results below it, which was the actual complaint: on mobile especially,
 * this used full-size result cards and was indistinguishable in height and
 * color from the search results underneath, just a longer wall of tiles to
 * scroll past. It's now a native <details> disclosure (open by default, no
 * client JS) so it can be collapsed out of the way entirely, and the cards
 * are a single compact row per faculty that scrolls horizontally on mobile
 * instead of stacking.
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
    <details
      open
      className="group relative overflow-hidden rounded-xl border-2 border-[#F0DCA0] bg-[#FFFDF7]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F5A623] to-[#E5A23C]"
      />

      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4 md:p-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F5A623] to-[#E5A23C] text-white"
          >
            <Target className="size-4" />
          </span>
          <h2 className="text-lg font-bold text-[#1F2A44] md:text-xl">
            {t("recommendedTitle")}
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFF6E2] px-2 py-1 text-xs font-bold text-[#B77714]">
            <span className="ul-blink-warm inline-flex size-1.5 rounded-full bg-[#E5A23C]" />
            {t("recommendedBadge")}
          </span>
        </div>

        <ChevronDown
          className="size-5 shrink-0 text-[#B77714] transition-transform duration-300 group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="px-4 pb-4 md:px-5 md:pb-5">
        <p className="text-sm text-[#7A6440]">
          {hasProfile ? (
            t("recommendedSubtitle")
          ) : (
            <>
              {t("recommendedNoProfile")}{" "}
              <Link
                href="/app/profile"
                className="font-semibold text-[#B77714] hover:underline"
              >
                {tProfile("completeProfile")}
              </Link>
            </>
          )}
        </p>

        {/* One horizontally-scrolling row on mobile (the actual fix for
            "too many tiles"), a compact grid from sm up where there's room
            to spare. */}
        <div className="mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {faculties.map((faculty) => (
            <div key={faculty.id} className="w-[230px] shrink-0 snap-start sm:w-auto">
              <RecommendedFacultyCard faculty={faculty} />
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
