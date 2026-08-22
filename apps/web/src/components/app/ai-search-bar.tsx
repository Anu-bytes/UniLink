"use client";

import { Lightbulb, Loader2, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { SplashLoader } from "@/components/splash-loader";
import { useRouter } from "@/i18n/navigation";
import type { MatchedTerm } from "@/lib/search-query";

/**
 * The natural-language search field. Submitting posts the raw text to the parse
 * route, which resolves it to filters; the resolved filters go straight into
 * the URL, so the results below are plain server-rendered output.
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

  function clear() {
    setValue("");
    startTransition(() => router.replace("/app/search"));
  }

  const busy = isPending || isParsing;

  return (
    <div>
      {/* One unified control: the field and its button share a border that
          lights up together on focus, rather than sitting as two separate
          boxes inside a tinted panel. */}
      <form
        onSubmit={submit}
        className="flex items-center gap-1.5 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-[#1E6DEB]"
      >
        <span className="ms-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]">
          <Search className="size-4" aria-hidden />
        </span>

        <label htmlFor="ai-search" className="sr-only">
          {t("title")}
        </label>
        <input
          id="ai-search"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t("aiPlaceholder")}
          className="h-12 min-w-0 flex-1 bg-transparent px-1 text-[15px] text-[#1F2A44] outline-none placeholder:text-[#98A0B4]"
        />

        {value ? (
          <button
            type="button"
            onClick={clear}
            aria-label={t("clearSearch")}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#98A0B4] transition-colors hover:bg-slate-100 hover:text-[#1F2A44]"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1E6DEB] px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#1859c4] disabled:opacity-70"
        >
          {busy ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            <Search className="size-5 sm:hidden" aria-hidden />
          )}
          <span className="hidden sm:inline">{t("aiButton")}</span>
        </button>
      </form>

      {/* Hint sits under the field as a caption, so it stops competing with
          the input for attention. */}
      <p className="mt-2.5 flex items-start gap-1.5 px-1 text-xs leading-5 text-[#5a6072]">
        <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-[#1E6DEB]" aria-hidden />
        <span>
          <span className="font-semibold text-[#1E6DEB]">{t("aiLabel")}</span>{" "}
          {t("aiHint")}
        </span>
      </p>

      {/* While the query is being resolved and the results re-render, the
          splash mark stands in for the answer that is on its way. The stale
          results stay below it rather than being torn down. */}
      {busy ? (
        <div className="mt-4 rounded-2xl bg-[#F5F8FF] px-6 py-8 ring-1 ring-[#1E6DEB]/10">
          <SplashLoader label={t("searching")} size="6rem" />
        </div>
      ) : null}

      {!busy && (matched.length > 0 || unmatched.length > 0) ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          {matched.length > 0 ? (
            <>
              <span className="font-semibold text-[#5a6072]">
                {t("resolvedLabel")}
              </span>
              {matched.map((term) => (
                <span
                  key={`${term.kind}-${term.value}`}
                  className="rounded-md bg-[#EEF3FF] px-2 py-1 font-semibold text-[#1E3A8A]"
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
