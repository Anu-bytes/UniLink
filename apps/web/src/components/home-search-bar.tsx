"use client";

import { Loader2, Lock, Search, Sparkles, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import type { MatchedTerm } from "@/lib/search-query";

/**
 * The quick search above "Featured Universities". Signed-in students already
 * have the full AI search in the app, so their box stays a blurred CTA
 * pointing there.
 *
 * Signed-out visitors get a real, working search: submitting still jumps to
 * the public /universities directory, no account required, same as before.
 * What's new is that as they type, it also calls the same parser the in-app
 * search uses and shows the resolved filters live underneath (matched
 * fields/cities/budget, unmatched words), a free preview of what Smart
 * Search would do with that query, with the "register for the real thing"
 * CTA carrying the typed text along to onboarding.
 */
export function HomeSearchBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const t = useTranslations("Home.landing.quickSearch");
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [matched, setMatched] = useState<MatchedTerm[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    // The signed-in box is a static blurred CTA (see below); it never takes
    // input, so there's nothing to parse.
    if (isAuthenticated) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = value.trim();
    if (query.length < 3) {
      setMatched([]);
      setUnmatched([]);
      setIsParsing(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const id = ++requestId.current;
      setIsParsing(true);
      try {
        const response = await fetch("/api/programs/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, locale }),
        });
        if (!response.ok) throw new Error(await response.text());
        const data: { matched: MatchedTerm[]; unmatched: string[] } =
          await response.json();
        if (id === requestId.current) {
          setMatched(data.matched);
          setUnmatched(data.unmatched);
        }
      } catch {
        // The live preview is a nicety, not a requirement, so a failed parse
        // just shows nothing rather than an error.
      } finally {
        if (id === requestId.current) setIsParsing(false);
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, locale, isAuthenticated]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAuthenticated) return;
    const query = value.trim();
    router.push(`/universities${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  const showPreview =
    !isAuthenticated && (matched.length > 0 || unmatched.length > 0);

  // So clicking "Register free" after typing a query carries it through to
  // onboarding, and out the other end into Smart Search once they're in
  // (see wizard.tsx), so the AI preview isn't a dead end.
  const registerHref = value.trim()
    ? `/onboarding?q=${encodeURIComponent(value.trim())}`
    : "/onboarding";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative">
        <form
          onSubmit={submit}
          aria-hidden={isAuthenticated}
          inert={isAuthenticated ? true : undefined}
          className={`flex items-center gap-1.5 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.35)] ring-1 ring-black/5 transition-colors focus-within:ring-2 focus-within:ring-[#1E6DEB] ${
            isAuthenticated ? "pointer-events-none select-none blur-[3px]" : ""
          }`}
        >
          <span className="ms-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]">
            {isParsing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Search className="size-4" aria-hidden />
            )}
          </span>
          <label htmlFor="home-university-search" className="sr-only">
            {t("title")}
          </label>
          <input
            id="home-university-search"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t("placeholder")}
            tabIndex={isAuthenticated ? -1 : undefined}
            className="h-12 min-w-0 flex-1 bg-transparent px-1 text-[15px] text-[#1F2A44] outline-none placeholder:text-[#98A0B4]"
          />
          <button
            type="submit"
            tabIndex={isAuthenticated ? -1 : undefined}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[#1E6DEB] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1859c4]"
          >
            {t("button")}
          </button>
        </form>

        {isAuthenticated ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              href="/app/search"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1E6DEB] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,109,235,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4] hover:shadow-[0_20px_40px_-12px_rgba(30,109,235,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <Sparkles className="size-4 shrink-0" aria-hidden />
              {t("lockedCta")}
              <Lock className="size-3.5 shrink-0 opacity-70" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>

      {/* Proof the box actually understood the query, not just matched
          substrings: the same resolved/unmatched chips the in-app AI search
          shows, live as you type. This is the whole point of the redesign,
          visitors feel the capability here, before the register wall shows
          up at submit. */}
      {showPreview ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="font-semibold text-white/70">{t("previewLabel")}</span>
          {matched.map((term) => (
            <span
              key={`${term.kind}-${term.value}`}
              className="rounded-full bg-white px-2.5 py-1 font-semibold text-[#1E3A8A]"
            >
              {term.label}
            </span>
          ))}
          {unmatched.slice(0, 3).map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-white/70 ring-1 ring-white/25"
            >
              <X className="size-3" aria-hidden />
              {word}
            </span>
          ))}
        </div>
      ) : null}

      {isAuthenticated ? null : (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-white/85">
            <Sparkles className="size-4 shrink-0 text-[#F5A623]" aria-hidden />
            {matched.length > 0 ? t("unlockHintActive") : t("unlockHint")}
          </span>
          <span className="flex items-center gap-2">
            <Link
              href={registerHref}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-[#1E6DEB] shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("registerCta")}
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/50 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("loginCta")}
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
