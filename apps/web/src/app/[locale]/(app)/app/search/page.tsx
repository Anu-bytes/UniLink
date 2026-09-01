import { Building2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { AiSearchBar } from "@/components/app/ai-search-bar";
import { FacultyCard } from "@/components/app/faculty-card";
import { FilterBar } from "@/components/app/filter-bar";
import { SearchModeSwitch, type SearchMode } from "@/components/app/search-mode-switch";
import { SearchPagination } from "@/components/app/search-pagination";
import { SortSelect } from "@/components/app/sort-select";
import { UniversityFilterBar } from "@/components/app/university-filter-bar";
import { UniversityResultCard } from "@/components/app/university-result-card";
import { UniversitySearchBar } from "@/components/app/university-search-bar";
import { Link } from "@/i18n/navigation";
import { getPublishedUniversities, getUniversityCities } from "@/lib/catalog";
import { searchFaculties, type FacultySearchPage } from "@/lib/faculty-search";
import { MAX_CITIES, parseSearchFilters, type SearchFilters } from "@/lib/program-filters";
import { getSearchVocabulary } from "@/lib/program-search";
import { parseSearchQuery, type MatchedTerm } from "@/lib/search-query";

/** No query text and no filter picked: nothing has actually been asked for
 * yet, so there's nothing to run `searchFaculties` against. Used both to
 * skip that query entirely and to decide which empty state to show. */
function hasFacultySearch(filters: SearchFilters): boolean {
  return Boolean(
    filters.q?.trim() ||
      filters.fields?.length ||
      filters.levels?.length ||
      filters.cities?.length ||
      filters.universities?.length ||
      filters.faculties?.length ||
      filters.universityTypes?.length ||
      filters.tags?.length ||
      filters.minTuition != null ||
      filters.maxTuition != null,
  );
}

const EMPTY_FACULTY_PAGE: FacultySearchPage = {
  results: [],
  total: 0,
  pageCount: 1,
  page: 1,
  pageSize: 0,
  broadened: false,
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const t = await getTranslations("Search");
  const raw = await searchParams;
  const mode: SearchMode = raw.mode === "universities" ? "universities" : "faculties";

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 pb-32 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
        {t("title")}
      </h1>

      {/* Directly above the search bar it controls, with its own label, so
          it reads as "this decides what you're searching for" rather than a
          secondary control off to the side of the page title, which is what
          was making people miss what it did. */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-[#5a6072]">
          {t("modeLabel")}
        </p>
        <SearchModeSwitch
          mode={mode}
          facultiesLabel={t("modeFaculties")}
          universitiesLabel={t("modeUniversities")}
        />
      </div>

      {mode === "universities" ? (
        <UniversitiesSearchView raw={raw} />
      ) : (
        <FacultiesSearchView raw={raw} />
      )}
    </div>
  );
}

async function FacultiesSearchView({
  raw,
}: {
  raw: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations("Search");
  const tFaculty = await getTranslations("FacultySearch");
  const locale = await getLocale();
  const session = await auth();
  const userId = session?.user?.id ?? null;

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

  const searched = hasFacultySearch(filters);

  const [page, cities] = await Promise.all([
    searched ? searchFaculties(locale, filters, userId, unmatched) : EMPTY_FACULTY_PAGE,
    getUniversityCities(locale),
  ]);

  return (
    <>
      <div className="mt-5">
        <AiSearchBar initialQuery={filters.q ?? ""} matched={matched} />
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

      {searched ? (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#1F2A44] md:text-2xl">
                <span aria-hidden className="h-6 w-1.5 rounded-full bg-[#1E6DEB]" />
                {tFaculty("resultsTitle")}
              </h2>
              <p className="mt-1 text-sm text-[#5a6072]">
                {tFaculty("resultsSubtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="rounded-full bg-[#EEF3FF] px-3 py-1.5 text-sm font-bold text-[#1E6DEB]">
                {tFaculty("resultCount", { count: page.total })}
              </p>
              <SortSelect filters={filters} />
            </div>
          </div>

          {/* Shown when the named faculty had no match and the search widened
              to others teaching the same subjects. */}
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
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-slate-200 bg-[#F7F9FE] px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]">
            <Search className="size-6" aria-hidden />
          </span>
          <h3 className="mt-4 text-lg font-bold text-[#1F2A44]">
            {t("promptTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
            {t("promptBody")}
          </p>
        </div>
      )}
    </>
  );
}

async function UniversitiesSearchView({
  raw,
}: {
  raw: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations("Search");
  const tDir = await getTranslations("UniversityDirectory");
  const locale = await getLocale();

  const query = (typeof raw.q === "string" ? raw.q : "").trim();
  const type = typeof raw.type === "string" ? raw.type : "";
  const cities = typeof raw.city === "string"
    ? raw.city.split(",").map((value) => value.trim()).filter(Boolean).slice(0, MAX_CITIES)
    : [];
  const rawPage = typeof raw.page === "string" ? Number(raw.page) : 1;
  const requestedPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const searched = Boolean(query || type || cities.length > 0);

  const [page, cityOptions] = await Promise.all([
    searched
      ? getPublishedUniversities(
          locale,
          {
            q: query || undefined,
            types: type ? [type as "PUBLIC" | "PRIVATE" | "SPECIALIZED"] : undefined,
            cities: cities.length > 0 ? cities : undefined,
          },
          requestedPage,
        )
      : Promise.resolve({ results: [], total: 0, page: 1, pageCount: 1 }),
    getUniversityCities(locale),
  ]);

  return (
    <>
      <div className="mt-5">
        <UniversitySearchBar initialQuery={query} type={type} cities={cities} />
      </div>

      <div className="mt-4">
        <UniversityFilterBar
          query={query}
          type={type}
          cities={cities}
          cityOptions={cityOptions}
        />
      </div>

      {searched ? (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#1F2A44] md:text-2xl">
                <span aria-hidden className="h-6 w-1.5 rounded-full bg-[#F82C1F]" />
                {t("universitiesResultsTitle")}
              </h2>
              <p className="mt-1 text-sm text-[#5a6072]">
                {t("universitiesResultsSubtitle")}
              </p>
            </div>
            <p className="rounded-full bg-[#FFF0EE] px-3 py-1.5 text-sm font-bold text-[#F82C1F]">
              {tDir("resultCount", { count: page.total })}
            </p>
          </div>

          {page.results.length > 0 ? (
            <>
              <UniversityPagination
                query={query}
                type={type}
                cities={cities}
                page={page.page}
                totalPages={page.pageCount}
                className="mt-5 mb-1"
              />

              <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {page.results.map((university) => (
                  <UniversityResultCard key={university.id} university={university} />
                ))}
              </div>

              <UniversityPagination
                query={query}
                type={type}
                cities={cities}
                page={page.page}
                totalPages={page.pageCount}
              />
            </>
          ) : (
            <div className="mt-5 rounded-xl bg-[#F5F8FF] px-6 py-14 text-center">
              <h3 className="text-lg font-bold text-[#1F2A44]">
                {t("universitiesEmptyTitle")}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
                {t("universitiesEmptyBody")}
              </p>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-slate-200 bg-[#FFF7F6] px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#FFF0EE] text-[#F82C1F]">
            <Building2 className="size-6" aria-hidden />
          </span>
          <h3 className="mt-4 text-lg font-bold text-[#1F2A44]">
            {t("universitiesPromptTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
            {t("universitiesPromptBody")}
          </p>
        </div>
      )}
    </>
  );
}

/** Same visual language as SearchPagination (faculty mode), red instead of
 * blue, and building its own href since a university search's URL state
 * (`mode` + `q` + `page`) doesn't fit SearchFilters, which that component is
 * built around. */
async function UniversityPagination({
  query,
  type,
  cities,
  page,
  totalPages,
  className = "mt-8",
}: {
  query: string;
  type: string;
  cities: string[];
  page: number;
  totalPages: number;
  className?: string;
}) {
  const t = await getTranslations("Search");

  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams({ mode: "universities", page: String(target) });
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (cities.length > 0) params.set("city", cities.join(","));
    return `/app/search?${params.toString()}`;
  };

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
        <span className="hidden min-h-11 items-center gap-1 rounded-lg px-4 text-sm font-semibold text-[#C7CCDA] sm:inline-flex">
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
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#F82C1F] bg-[#F82C1F] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C81F15]"
        >
          {t("next")}
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      ) : (
        <span className="hidden min-h-11 items-center gap-1 rounded-lg px-4 text-sm font-semibold text-[#C7CCDA] sm:inline-flex">
          {t("next")}
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
        </span>
      )}
    </nav>
  );
}
