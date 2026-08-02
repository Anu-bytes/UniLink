"use client";

import { Loader2, Sparkles, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import type { MatchedTerm } from "@/lib/search-query";

/**
 * The "search with AI" panel. Submitting posts the raw text to the parse route,
 * which resolves it to filters; the resolved filters go straight into the URL,
 * so the results below are plain server-rendered output.
 */
export function AiSearchBar({
  initialQuery,
  matched,
  unmatched,
}: {
  initialQuery: string;
  matched: MatchedTerm[];
  unmatched: string[];
}) {
  const t = useTranslations("Search");
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const [isParsing, setIsParsing] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();

    if (!query) {
      startTransition(() => router.replace("/app/search"));
      return;
    }

    setIsParsing(true);
    try {
      const response = await fetch("/api/programs/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, locale }),
      });
      if (!response.ok) throw new Error(await response.text());

      const data: { search: string } = await response.json();
      startTransition(() => router.replace(`/app/search?${data.search}`));
    } catch (error) {
      console.error("Unable to interpret this search", error);
      // Fall back to passing the raw text through; the server parses it too.
      startTransition(() =>
        router.replace(`/app/search?q=${encodeURIComponent(query)}`),
      );
    } finally {
      setIsParsing(false);
    }
  }

  const busy = isPending || isParsing;

  return (
    <div className="rounded-xl border border-slate-200 bg-[#F8FAFF] p-4 md:p-5">
      <p className="flex flex-wrap items-center gap-2 text-sm text-[#5a6072]">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EFE9FE] px-2 py-1 text-xs font-bold text-[#6B3FD4]">
          <Sparkles className="size-3.5" aria-hidden />
          {t("aiLabel")}
        </span>
        {t("aiHint")}
      </p>

      <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Sparkles
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#6B3FD4]"
            aria-hidden
          />
          <label htmlFor="ai-search" className="sr-only">
            {t("title")}
          </label>
          <input
            id="ai-search"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t("aiPlaceholder")}
            className="h-12 w-full rounded-lg border border-slate-200 bg-white ps-9 pe-3 text-sm text-[#1F2A44] outline-none focus-visible:border-[#1E6DEB] focus-visible:ring-2 focus-visible:ring-[#1E6DEB]/25"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1859c4] disabled:opacity-70"
        >
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {t("aiButton")}
        </button>
      </form>

      {matched.length > 0 || unmatched.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {matched.length > 0 ? (
            <>
              <span className="font-semibold text-[#5a6072]">
                {t("resolvedLabel")}
              </span>
              {matched.map((term) => (
                <span
                  key={`${term.kind}-${term.value}`}
                  className="rounded-md bg-white px-2 py-1 font-semibold text-[#1E3A8A] ring-1 ring-slate-200"
                >
                  {term.label}
                </span>
              ))}
            </>
          ) : null}

          {unmatched.length > 0 ? (
            <>
              <span className="ms-2 font-semibold text-[#98A0B4]">
                {t("unmatchedLabel")}
              </span>
              {unmatched.slice(0, 5).map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[#98A0B4] ring-1 ring-slate-200"
                >
                  <X className="size-3" aria-hidden />
                  {word}
                </span>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
