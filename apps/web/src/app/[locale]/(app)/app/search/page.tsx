import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { AiSearchBar } from "@/components/app/ai-search-bar";
import { FacultyCard } from "@/components/app/faculty-card";
import { FilterBar } from "@/components/app/filter-bar";
import { SearchPagination } from "@/components/app/search-pagination";
import { SortSelect } from "@/components/app/sort-select";
import { getUniversityCities } from "@/lib/catalog";
import { searchFaculties } from "@/lib/faculty-search";
import { parseSearchFilters, type SearchFilters } from "@/lib/program-filters";
import { getSearchVocabulary } from "@/lib/program-search";
import { parseSearchQuery, type MatchedTerm } from "@/lib/search-query";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const t = await getTranslations("Search");
  const tFaculty = await getTranslations("FacultySearch");
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
      urlFilters.faculties?.length ||
      urlFilters.universityTypes?.length ||
      urlFilters.tags?.length ||
      urlFilters.minTuition != null ||
      urlFilters.maxTuition != null;

    if (!hasExplicit) {
      filters = { ...parsed.filters, sort: urlFilters.sort, page: urlFilters.page };
    }
  }

  const [page, cities] = await Promise.all([
    searchFaculties(locale, filters, userId, unmatched),
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

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#1F2A44] md:text-2xl">
              <span aria-hidden className="h-6 w-1.5 rounded-full bg-[#F82C1F]" />
              {tFaculty("resultsTitle")}
            </h2>
            <p className="mt-1 text-sm text-[#5a6072]">
              {tFaculty("resultsSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="rounded-full bg-[#FFF0EE] px-3 py-1.5 text-sm font-bold text-[#F82C1F]">
              {tFaculty("resultCount", { count: page.total })}
            </p>
            <SortSelect filters={filters} />
          </div>
        </div>

        {/* Shown when the named faculty had no match and the search widened to
            others teaching the same subjects. */}
        {page.broadened ? (
          <p className="mt-4 rounded-lg border border-[#F3DFB4] bg-[#FFFBF2] px-4 py-3 text-sm text-[#7A6440]">
            {tFaculty("broadened")}
          </p>
        ) : null}

        {page.results.length > 0 ? (
          <>
            <SearchPagination
              filters={filters}
              page={page.page}
              totalPages={page.pageCount}
              className="mt-5 mb-1"
            />

            <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {page.results.map((faculty) => (
                <FacultyCard key={faculty.id} faculty={faculty} />
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
