import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { QUICK_ACTION_ICONS, adminQuickActions, type AdminLevel } from "@/lib/admin-nav";

/** The overview's grid of common jobs for this admin level. */
export async function QuickActions({ level }: { level: AdminLevel }) {
  const t = await getTranslations("AdminAccess.quick");
  const actions = adminQuickActions(level);

  return (
    <section aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading" className="text-[15px] font-semibold text-[#0F172A]">
        {t("heading")}
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = QUICK_ACTION_ICONS[action.key];
          return (
            <Link
              key={action.key}
              href={action.href}
              className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 transition-colors hover:border-[#1E6DEB]/40 hover:bg-[#F7F9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#1E6DEB]">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[#0F172A]">
                  {t(`items.${action.key}.title`)}
                  <ArrowRight
                    className="size-3.5 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1E6DEB] rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-5 text-[#64748B]">
                  {t(`items.${action.key}.description`)}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
