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
}: {
  filters: SearchFilters;
  page: number;
  totalPages: number;
}) {
  const t = await getTranslations("Search");

  if (totalPages <= 1) return null;

  const hrefFor = (target: number) =>
    `/app/search?${filtersToSearchParams({ ...filters, page: target }).toString()}`;

  return (
    <nav
      aria-label={t("pageOf", { page, total: totalPages })}
      className="mt-8 flex items-center justify-center gap-3"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          scroll={false}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-[#1F2A44] hover:bg-slate-50"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("previous")}
        </Link>
      ) : null}

      <span className="text-sm font-semibold text-[#5a6072]">
        {t("pageOf", { page, total: totalPages })}
      </span>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          scroll={false}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-[#1F2A44] hover:bg-slate-50"
        >
          {t("next")}
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
