"use client";

import { ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { useCompare } from "@/components/app/compare-context";
import { UniversityLogo } from "@/components/university-logo";

/**
 * Sticky bar that appears once anything is selected for comparison. Hidden on
 * the compare page itself, where the table already shows the selection.
 */
export function CompareTray() {
  const t = useTranslations("Compare.tray");
  const { entries, ids, kind, clear, remove, ready } = useCompare();
  const pathname = usePathname();

  if (!ready || entries.length === 0 || pathname.startsWith("/app/compare")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_16px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex max-w-[86rem] flex-wrap items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {entries.slice(0, 4).map((entry) => (
              <UniversityLogo
                key={entry.id}
                name={entry.universityName}
                logoUrl={entry.logoUrl}
                className="size-10 ring-2 ring-white"
                textClassName="text-xs"
              />
            ))}
          </div>
          <div>
            <p className="text-sm font-bold text-[#1F2A44]">
              {t("title", { count: entries.length })}
            </p>
            <p className="text-xs text-[#5a6072]">{t("subtitle")}</p>
          </div>
        </div>

        <ul className="hidden flex-wrap items-center gap-2 lg:flex">
          {entries.map((entry) => (
            <li key={entry.id}>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 py-1 ps-3 pe-1 text-xs font-semibold text-[#1F2A44]">
                <span className="max-w-40 truncate">{entry.universityName}</span>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  aria-label={t("remove", { name: entry.name })}
                  className="flex size-6 items-center justify-center rounded-full text-[#98A0B4] hover:bg-slate-100 hover:text-[#1F2A44]"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>

        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-[#1F2A44] hover:bg-slate-50"
          >
            {t("clear")}
          </button>
          <Link
            href={`/app/compare?ids=${ids.join(",")}${kind === "faculty" ? "&kind=faculty" : ""}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1E6DEB] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1859c4]"
          >
            {t("compare")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
