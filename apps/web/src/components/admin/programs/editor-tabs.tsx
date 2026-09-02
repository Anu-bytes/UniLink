import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const PROGRAM_EDITOR_TABS = [
  "details",
  "fees",
  "intakes",
  "english",
] as const;

export type ProgramEditorTab = (typeof PROGRAM_EDITOR_TABS)[number];

export function isProgramEditorTab(
  value: string | undefined,
): value is ProgramEditorTab {
  return (PROGRAM_EDITOR_TABS as readonly string[]).includes(value ?? "");
}

/**
 * Links rather than client state, matching the university editor: a tab is
 * then linkable, survives the refresh after a save, and renders server-side on
 * first paint.
 */
export function ProgramEditorTabs({
  programId,
  active,
}: {
  programId: string;
  active: ProgramEditorTab;
}) {
  const t = useTranslations("Admin");

  return (
    <nav
      aria-label={t("programs.tabs.label")}
      className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
    >
      {PROGRAM_EDITOR_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <Link
            key={tab}
            // Details is the default, so it stays out of the query string.
            href={`/admin/programs/${programId}${tab === "details" ? "" : `?tab=${tab}`}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-lg px-3.5 text-[13.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
              isActive
                ? "bg-[#EAF2FE] text-[#1E6DEB]"
                : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]",
            )}
          >
            {t(`programs.tabs.${tab}`)}
          </Link>
        );
      })}
    </nav>
  );
}
