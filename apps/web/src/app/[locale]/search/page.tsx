import type { Metadata } from "next";
import { SlidersHorizontal } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { listUniversities } from "@/lib/catalog";
import { parseFilters, parseSort, parsePage } from "@/lib/query";
import { formatNumber } from "@/lib/format";
import { UNIVERSITIES } from "@/data/universities";
import { Filters } from "@/components/Filters";
import { SortSelect } from "@/components/SortSelect";
import { SearchResults } from "@/components/SearchResults";
import { NearMeResults } from "@/components/NearMeResults";

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getMessages(locale).search.title };
}

function cityOptions() {
  return Array.from(
    new Map(UNIVERSITIES.map((u) => [u.city.en, { value: u.city.en, label: u.city }])).values(),
  );
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SP>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const m = getMessages(locale);

  const isNear = !!sp.near;
  const filters = parseFilters(sp);
  const sort = parseSort(sp);
  const { page, pageSize } = parsePage(sp);
  const list = isNear ? null : listUniversities(filters, { sort, page, pageSize, locale });
  const cities = cityOptions();

  return (
    <div className="container-page py-6">
      <header className="mb-5">
        <h1 className="font-head text-2xl font-bold text-ink">
          {isNear ? m.nearme.title : m.search.title}
        </h1>
        {!isNear && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {filters.q ? (
                <>
                  {m.search.resultsFor} <span className="font-medium text-ink">“{filters.q}”</span> ·{" "}
                </>
              ) : null}
              {formatNumber(list!.pagination.total, locale)}{" "}
              {list!.pagination.total === 1 ? m.common.result : m.common.results}
            </p>
            <SortSelect />
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-card border border-line bg-surface p-4">
            <Filters cities={cities} />
          </div>
        </aside>

        {/* Mobile filters */}
        <details className="rounded-card border border-line bg-surface lg:hidden">
          <summary className="flex cursor-pointer items-center gap-2 p-4 text-sm font-semibold text-ink">
            <SlidersHorizontal className="size-4" /> {m.search.filters}
          </summary>
          <div className="border-t border-line p-4">
            <Filters cities={cities} />
          </div>
        </details>

        <section>
          {isNear ? <NearMeResults /> : <SearchResults items={list!.data} />}
        </section>
      </div>
    </div>
  );
}
