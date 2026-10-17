"use client";

import { ChevronDown, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { QUICK_ACTION_ICONS, adminQuickActions, type AdminLevel } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

/** The console header's "Quick actions" dropdown: the common jobs for this level. */
export function QuickActionsMenu({ level }: { level: AdminLevel }) {
  const t = useTranslations("AdminAccess.quick");
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  // Counts as open only on the route it was opened on, so navigating closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpenAt(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenAt(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpenAt(open ? null : pathname)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-1.5 rounded-lg bg-[#1E6DEB] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      >
        <Zap className="size-4" aria-hidden />
        <span className="hidden sm:inline">{t("button")}</span>
        <span className="sr-only sm:hidden">{t("button")}</span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          {adminQuickActions(level).map((action) => {
            const Icon = QUICK_ACTION_ICONS[action.key];
            return (
              <Link
                key={action.key}
                href={action.href}
                role="menuitem"
                onClick={() => setOpenAt(null)}
                className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold text-[#0F172A]">
                    {t(`items.${action.key}.title`)}
                  </span>
                  <span className="block text-[12px] leading-[1.15rem] text-[#64748B]">
                    {t(`items.${action.key}.description`)}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
