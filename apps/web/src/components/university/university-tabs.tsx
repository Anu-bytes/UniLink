import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const UNIVERSITY_TABS = [
  "about",
  "faculties",
  "location",
  "requirements",
  "criteria",
  "scores",
  "tuition",
] as const;

export type UniversityTab = (typeof UNIVERSITY_TABS)[number];

export function isUniversityTab(value: string | undefined): value is UniversityTab {
  return (UNIVERSITY_TABS as readonly string[]).includes(value ?? "");
}

/**
 * The tab bar is a row of links rather than client state, so every tab has its
 * own shareable URL and renders server-side on first paint.
 */
export async function UniversityTabs({
  slug,
  active,
}: {
  slug: string;
  active: UniversityTab;
}) {
  const t = await getTranslations("UniversityDetail");

  return (
    <nav
      aria-label={t("breadcrumbUniversities")}
      className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 px-4 py-5 md:px-6"
    >
      {UNIVERSITY_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <Link
            key={tab}
            href={`/universities/${slug}${tab === "about" ? "" : `?tab=${tab}`}`}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] md:px-5 md:text-base",
              isActive
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-[#5a6072] hover:bg-[#EEF3FF] hover:text-[#1E3A8A]",
            )}
          >
            {t(`tabs.${tab}`)}
          </Link>
        );
      })}
    </nav>
  );
}
