"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";

/**
 * A plain name/city search, not the AI natural-language parser AiSearchBar
 * uses for faculties. There's no filter vocabulary to resolve here (a
 * university search is just "does this text match a name or city"), so
 * reusing the NLP parse endpoint would be pretend intelligence for a plain
 * substring match.
 */
export function UniversitySearchBar({
  initialQuery,
  type = "",
  cities = [],
}: {
  initialQuery: string;
  /** Carried through unchanged so submitting a new query doesn't drop the
   * type/city chips picked in UniversityFilterBar above the results. */
  type?: string;
  cities?: string[];
}) {
  const t = useTranslations("UniversityDirectory");
  const tSearch = useTranslations("Search");
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function hrefFor(query: string) {
    const params = new URLSearchParams({ mode: "universities" });
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (cities.length > 0) params.set("city", cities.join(","));
    return `/app/search?${params.toString()}`;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.replace(hrefFor(value.trim()));
  }

  function clear() {
    setValue("");
    router.replace(hrefFor(""));
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-1.5 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-[#F82C1F]"
    >
      <span className="ms-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0EE] text-[#F82C1F]">
        <Search className="size-4" aria-hidden />
      </span>

      <label htmlFor="university-search" className="sr-only">
        {t("searchLabel")}
      </label>
      <input
        id="university-search"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("searchPlaceholder")}
        className="h-12 min-w-0 flex-1 bg-transparent px-1 text-[15px] text-[#1F2A44] outline-none placeholder:text-[#98A0B4]"
      />

      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label={tSearch("clearSearch")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#98A0B4] transition-colors hover:bg-slate-100 hover:text-[#1F2A44]"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}

      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F82C1F] px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#C81F15]"
      >
        <Search className="size-5 sm:hidden" aria-hidden />
        <span className="hidden sm:inline">{t("searchLabel")}</span>
      </button>
    </form>
  );
}
