import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const UNIVERSITY_TABS = ["faculties", "scores", "gallery", "location"] as const;

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
      className="border-b border-slate-100 px-4 py-3 md:px-6 md:py-5"
    >
      {/* Phone: one full-width segmented control (four equal segments in a
          tinted track). md+: the centred pill row. */}
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-full bg-[#F1F4FA] p-1 md:flex md:max-w-none md:flex-wrap md:items-center md:justify-center md:gap-2 md:bg-transparent md:p-0">
        {UNIVERSITY_TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <Link
              key={tab}
              href={`/universities/${slug}${tab === "faculties" ? "" : `?tab=${tab}`}`}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center justify-center rounded-full px-1.5 text-center text-[13px] font-semibold leading-tight sm:px-3 sm:text-sm md:whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] md:min-h-11 md:px-5 md:text-base",
                isActive
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "text-[#5a6072] hover:bg-white hover:text-[#1E3A8A] md:hover:bg-[#EEF3FF]",
              )}
            >
              {/* Long labels get a short phone version (quarter-width segment). */}
              {t.has(`tabsShort.${tab}`) ? (
                <>
                  <span className="md:hidden">{t(`tabsShort.${tab}`)}</span>
                  <span className="hidden md:inline">{t(`tabs.${tab}`)}</span>
                </>
              ) : (
                t(`tabs.${tab}`)
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
