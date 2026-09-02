import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * Card shell for the three recent-activity lists. Every one of them carries a
 * "view all" link, and three identical links on one page are ambiguous to a
 * screen reader, so the accessible name names the section it belongs to.
 */
export async function OverviewCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations("Admin.overview");

  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
        <Link
          href={href}
          aria-label={t("viewAllSection", { section: title })}
          className="inline-flex shrink-0 items-center gap-1 rounded text-[13px] font-semibold text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {t("viewAll")}
          <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
      {children}
    </section>
  );
}
