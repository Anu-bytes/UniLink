import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { AiSearchBar } from "@/components/app/ai-search-bar";
import { FilterBar } from "@/components/app/filter-bar";
import { ProgramCard } from "@/components/app/program-card";
import { RecommendedPanel } from "@/components/app/recommended-panel";
import { SearchPagination } from "@/components/app/search-pagination";
import { SortSelect } from "@/components/app/sort-select";
import { getUniversityCities } from "@/lib/catalog";
import { parseSearchFilters, type SearchFilters } from "@/lib/program-filters";
import {
  getMatchProfile,
  getRecommendedPrograms,
  getSearchVocabulary,
  searchPrograms,
} from "@/lib/program-search";
import { parseSearchQuery, type MatchedTerm } from "@/lib/search-query";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const t = await getTranslations("Search");
  const locale = await getLocale();
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const raw = await searchParams;
  const vocabulary = await getSearchVocabulary();

  // A bare `?q=` (typed straight into the URL, or the client-side fallback)
  // still gets parsed here, so the server is the single source of truth.
  const urlFilters = parseSearchFilters(raw);
  let filters: SearchFilters = urlFilters;
  let matched: MatchedTerm[] = [];
  let unmatched: string[] = [];

  if (urlFilters.q) {
    const parsed = parseSearchQuery(urlFilters.q, vocabulary, locale);
    matched = parsed.matched;
    unmatched = parsed.unmatched;

    // Explicit filters in the URL win over anything inferred from the text.
    const hasExplicit =
      urlFilters.fields?.length ||
      urlFilters.levels?.length ||
      urlFilters.cities?.length ||
      urlFilters.universities?.length ||
      urlFilters.universityTypes?.length ||
      urlFilters.tags?.length ||
      urlFilters.minTuition != null ||
      urlFilters.maxTuition != null;

    if (!hasExplicit) {
      filters = { ...parsed.filters, sort: urlFilters.sort, page: urlFilters.page };
    }
  }

  const [page, recommended, profile, cities] = await Promise.all([
    searchPrograms(locale, filters, userId),
    getRecommendedPrograms(locale, userId),
    getMatchProfile(userId),
    getUniversityCities(locale),
  ]);

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 pb-32 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
        {t("title")}
      </h1>

      <div className="mt-5">
        <AiSearchBar
          initialQuery={filters.q ?? ""}
          matched={matched}
          unmatched={unmatched}
        />
      </div>

      <div className="mt-5">
        <FilterBar
          filters={filters}
          options={{
            cities,
            universities: vocabulary.universities.map((university) => ({
              value: university.slug,
              label: university.name,
            })),
          }}
        />
      </div>

      <div className="mt-8">
        <RecommendedPanel programs={recommended} hasProfile={profile != null} />
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
              {t("moreTitle")}
            </h2>
            <p className="mt-1 text-sm text-[#5a6072]">{t("moreSubtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-[#5a6072]">
              {t("resultCount", { count: page.total })}
            </p>
            <SortSelect filters={filters} />
          </div>
        </div>

        {page.results.length > 0 ? (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {page.results.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>

            <SearchPagination
              filters={filters}
              page={page.page}
              totalPages={page.pageCount}
            />
          </>
        ) : (
          <div className="mt-5 rounded-xl bg-[#F5F8FF] px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-[#1F2A44]">
              {t("emptyTitle")}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
              {t("emptyBody")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
