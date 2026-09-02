import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const UNIVERSITY_EDITOR_TABS = [
  "details",
  "media",
  "features",
  "content",
  "scores",
] as const;

export type UniversityEditorTab = (typeof UNIVERSITY_EDITOR_TABS)[number];

export function isUniversityEditorTab(
  value: string | undefined,
): value is UniversityEditorTab {
  return (UNIVERSITY_EDITOR_TABS as readonly string[]).includes(value ?? "");
}

/**
 * Links rather than client state, the same way the public university page
 * works: a tab is then linkable, survives a refresh after a save, and renders
 * server-side on first paint.
 */
export function UniversityEditorTabs({
  universityId,
  active,
}: {
  universityId: string;
  active: UniversityEditorTab;
}) {
  const t = useTranslations("Admin");

  return (
    <nav
      aria-label={t("universities.tabs.label")}
      className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
    >
      {UNIVERSITY_EDITOR_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <Link
            key={tab}
            // Details is the default, so it stays out of the query string.
            href={`/admin/universities/${universityId}${
              tab === "details" ? "" : `?tab=${tab}`
            }`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-lg px-3.5 text-[13.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
              isActive
                ? "bg-[#EAF2FE] text-[#1E6DEB]"
                : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]",
            )}
          >
            {t(`universities.tabs.${tab}`)}
          </Link>
        );
      })}
    </nav>
  );
}
