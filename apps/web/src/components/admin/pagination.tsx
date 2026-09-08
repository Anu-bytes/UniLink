"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const CONTROL =
  "flex h-9 min-w-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300";

export function Pagination({
  page,
  totalPages,
  total,
  perPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  function goTo(next: number) {
    const target = Math.min(Math.max(1, next), Math.max(1, totalPages));
    const params = new URLSearchParams(searchParams.toString());
    // Page one is the default, so it stays out of the URL.
    if (target === 1) {
      params.delete("page");
    } else {
      params.set("page", String(target));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-[#64748B]">
        {t("common.showing")} {formatNumber(locale, from)}–{formatNumber(locale, to)}{" "}
        {t("common.of")} {formatNumber(locale, total)}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className={cn(CONTROL, "ps-2")}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("common.previous")}
        </button>

        <span className="px-1 text-[13px] tabular-nums text-[#64748B]">
          {t("common.page")} {formatNumber(locale, page)} / {formatNumber(locale, Math.max(1, totalPages))}
        </span>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className={cn(CONTROL, "pe-2")}
        >
          {t("common.next")}
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
