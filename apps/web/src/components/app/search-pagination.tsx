import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import {
  filtersToSearchParams,
  type SearchFilters,
} from "@/lib/program-filters";

export async function SearchPagination({
  filters,
  page,
  totalPages,
  className = "mt-8",
}: {
  filters: SearchFilters;
  page: number;
  totalPages: number;
  className?: string;
}) {
  const t = await getTranslations("Search");

  if (totalPages <= 1) return null;

  const hrefFor = (target: number) =>
    `/app/search?${filtersToSearchParams({ ...filters, page: target }).toString()}`;

  return (
    <nav
      aria-label={t("pageOf", { page, total: totalPages })}
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          scroll={false}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1F2A44] shadow-sm transition-colors hover:border-[#F82C1F]/30 hover:bg-[#FFF0EE] hover:text-[#F82C1F]"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("previous")}
        </Link>
      ) : (
        <span className="hidden sm:inline-flex min-h-11 items-center gap-1 rounded-lg px-4 text-sm font-semibold text-[#C7CCDA]">
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("previous")}
        </span>
      )}

      <span className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-[#1F2A44]">
        {t("pageOf", { page, total: totalPages })}
      </span>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          scroll={false}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#1E6DEB] bg-[#1E6DEB] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1859c4]"
        >
          {t("next")}
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      ) : (
        <span className="hidden sm:inline-flex min-h-11 items-center gap-1 rounded-lg px-4 text-sm font-semibold text-[#C7CCDA]">
          {t("next")}
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
        </span>
      )}
    </nav>
  );
}
