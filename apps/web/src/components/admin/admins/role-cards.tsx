"use client";

import { Building2, ClipboardCheck, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export const LEVEL_ROLES = ["UNIVERSITY_ADMIN", "REVIEWER", "ADMIN"] as const;
export type LevelRole = (typeof LEVEL_ROLES)[number];

const META: Record<LevelRole, { level: number; icon: typeof ShieldCheck; tint: string }> = {
  UNIVERSITY_ADMIN: { level: 1, icon: Building2, tint: "bg-[#EEF3FF] text-[#1E6DEB]" },
  REVIEWER: { level: 2, icon: ClipboardCheck, tint: "bg-[#E7F6EE] text-[#0F7B45]" },
  ADMIN: { level: 3, icon: ShieldCheck, tint: "bg-[#0B1220] text-white" },
};

/** The three admin levels as selectable cards, each saying what it can do. */
export function RoleCards({
  value,
  onChange,
  disabled,
  stacked,
}: {
  value: LevelRole;
  onChange: (role: LevelRole) => void;
  disabled?: boolean;
  /** One per row, for a narrow column. */
  stacked?: boolean;
}) {
  const t = useTranslations("Admin.admins.levels");
  return (
    <div role="radiogroup" className={cn("grid gap-2.5", !stacked && "sm:grid-cols-3")}>
      {LEVEL_ROLES.map((role) => {
        const meta = META[role];
        const active = value === role;
        return (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(role)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-3.5 text-start transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              active ? "border-[#1E6DEB] bg-[#F7F9FE] ring-1 ring-[#1E6DEB]" : "border-slate-200 hover:bg-slate-50",
            )}
          >
            <span className="flex w-full items-center justify-between">
              <span className={cn("flex size-8 items-center justify-center rounded-lg", meta.tint)}>
                <meta.icon className="size-4" aria-hidden />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                {t("levelN", { level: meta.level })}
              </span>
            </span>
            <span className="text-[14px] font-semibold text-[#0F172A]">{t(`${role}.title`)}</span>
            <span className="text-[12.5px] leading-snug text-[#64748B]">{t(`${role}.body`)}</span>
          </button>
        );
      })}
    </div>
  );
}
