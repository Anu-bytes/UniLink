import { Target } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { ProgramCard } from "@/components/app/program-card";
import type { ProgramResult } from "@/lib/program-search";

/**
 * The bordered "Recommended for you" block above the general results, ordered
 * by the match score computed from the student's onboarding profile.
 */
export async function RecommendedPanel({
  programs,
  hasProfile,
}: {
  programs: ProgramResult[];
  hasProfile: boolean;
}) {
  const t = await getTranslations("Search");
  const tProfile = await getTranslations("AppProfile");

  if (programs.length === 0) return null;

  return (
    <section className="rounded-xl border-2 border-[#1E6DEB]/25 bg-white p-4 md:p-5">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF3FF] px-2 py-1 text-xs font-bold text-[#1E3A8A]">
        <Target className="size-3.5" aria-hidden />
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
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
}
