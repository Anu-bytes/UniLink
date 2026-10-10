"use client";

import { ArrowRight, MapPin, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import {
  highlightParts,
  searchUniversities,
  useUniversityIndex,
} from "@/components/search/university-search";
import { UniversityLogo } from "@/components/university-logo";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTypewriter } from "@/hooks/use-typewriter";
import { cn } from "@/lib/utils";

/**
 * The homepage hero's search: one box, no filters, behaving like the header's
 * Quick search. Universities match instantly as you type (same index and
 * ranking as the palette); Enter opens the highlighted one, or searches
 * everything: the app search for signed-in students, the public directory
 * otherwise.
 */
export function HeroSearch({ isAuthenticated }: { isAuthenticated: boolean }) {
  const t = useTranslations("Home.landing");
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);

  const { entries } = useUniversityIndex(locale, focused || value.length > 0);
  const hits = useMemo(
    () =>
      entries && value.trim() ? searchUniversities(entries, value, 6) : [],
    [entries, value],
  );
  const open = focused && hits.length > 0;

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const examples = useMemo(
    () => t.raw("quickSearch.examples") as string[],
    [t],
  );
  const typed = useTypewriter(examples, !focused && !value && !reducedMotion);

  const popular = useMemo(() => t.raw("hero.popular") as string[], [t]);

  function searchFor(raw: string) {
    const query = raw.trim();
    if (isAuthenticated) {
      router.push(
        `/app/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
      );
    } else {
      router.push(
        `/universities${query ? `?q=${encodeURIComponent(query)}` : ""}`,
      );
    }
  }

  function searchAll() {
    searchFor(value);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const picked = active >= 0 ? hits[active] : undefined;
    if (picked) router.push(`/universities/${picked.entry.slug}`);
    else searchAll();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index <= 0 ? hits.length - 1 : index - 1));
    } else if (event.key === "Escape") {
      setActive(-1);
      (event.target as HTMLInputElement).blur();
    }
  }

  return (
    <div className="relative">
      {/* Brand gradient border (blue to red), brighter while focused. */}
      <div className="group/box rounded-2xl bg-gradient-to-r from-[#1E6DEB]/45 via-[#C9D8F5] to-[#F82C1F]/45 p-[1.5px] shadow-[0_24px_50px_-24px_rgba(30,109,235,0.55)] transition-all focus-within:from-[#1E6DEB] focus-within:to-[#F82C1F] focus-within:shadow-[0_24px_60px_-18px_rgba(30,109,235,0.6)] rtl:bg-gradient-to-l">
        <form
          onSubmit={submit}
          role="search"
          className="group flex items-center gap-2 rounded-[14.5px] bg-white p-2"
        >
          <Search
            className="ms-2.5 size-5 shrink-0 text-[#98A0B4] transition-colors group-focus-within:text-[#1E6DEB]"
            aria-hidden
          />
          <label htmlFor="hero-search" className="sr-only">
            {t("hero.searchLabel")}
          </label>
          <div className="relative min-w-0 flex-1">
            <input
              id="hero-search"
              // Plain text field: iOS restyles type="search" (rounded inset,
              // extra padding). The keyboard still shows a Search key.
              type="text"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setActive(-1);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-expanded={open}
              aria-controls="hero-search-results"
              aria-activedescendant={
                active >= 0 ? `hero-hit-${active}` : undefined
              }
              placeholder={typed ? "" : t("hero.searchPlaceholder")}
              className="h-12 w-full min-w-0 appearance-none rounded-none border-0 bg-transparent p-0 text-base text-[#1F2A44] outline-none placeholder:truncate placeholder:text-[#98A0B4]"
            />
            {/* Rotating example, drawn over the empty box like a placeholder. */}
            {typed ? (
              // Confined to the input's own width (inset-x-0 + clipping), so a
              // long example can never run under the Search button.
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-nowrap text-base text-[#98A0B4]"
              >
                <span className="me-1 shrink-0 font-semibold text-[#1E6DEB]">
                  {t("quickSearch.examplePrefix")}
                </span>
                <span className="min-w-0 truncate">{typed}</span>
                <span className="ul-caret ms-0.5 inline-block h-5 w-px shrink-0 bg-[#1E6DEB]" />
              </span>
            ) : null}
          </div>
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E6DEB] to-[#2F7BF5] px-5 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(30,109,235,0.9)] transition-all hover:-translate-y-0.5 hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 md:px-7 md:text-[15px]"
          >
            <Search className="size-4 sm:hidden" aria-hidden />
            <span className="max-sm:sr-only">{t("hero.searchButton")}</span>
          </button>
        </form>
      </div>

      {open ? (
        <div className="ul-tray-in absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl bg-white text-start shadow-[0_30px_60px_-20px_rgba(15,23,42,0.55)] ring-1 ring-black/5">
          <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-[#98A0B4]">
            {t("quickSearch.suggestions")}
          </p>
          <ul id="hero-search-results" role="listbox" className="px-2 pb-2">
            {hits.map((hit, index) => (
              <li
                key={hit.entry.slug}
                id={`hero-hit-${index}`}
                role="option"
                aria-selected={index === active}
                // mousedown, not click: the input's blur would otherwise close
                // the list before the click lands.
                onMouseDown={(event) => {
                  event.preventDefault();
                  router.push(`/universities/${hit.entry.slug}`);
                }}
                onMouseMove={() => setActive(index)}
                className={cn(
                  "ul-palette-row flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors",
                  index === active ? "bg-[#EEF4FF]" : "hover:bg-slate-50",
                )}
                style={{ animationDelay: `${index * 25}ms` }}
              >
                <UniversityLogo
                  name={hit.entry.name}
                  logoUrl={hit.entry.logoUrl}
                  className="size-9 shrink-0 ring-1 ring-slate-200"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#16233F]">
                    {highlightParts(hit.entry.name, value).map((part, i) =>
                      part.hit ? (
                        <mark
                          key={i}
                          className="rounded bg-[#FFE7A3] px-0.5 text-inherit"
                        >
                          {part.text}
                        </mark>
                      ) : (
                        <span key={i}>{part.text}</span>
                      ),
                    )}
                    {hit.entry.acronym ? (
                      <span
                        dir="ltr"
                        className="ms-2 rounded bg-[#1E6DEB]/10 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-[#1E6DEB]"
                      >
                        {hit.entry.acronym}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#5a6072]">
                    <MapPin
                      className="size-3 shrink-0 text-[#1E6DEB]"
                      aria-hidden
                    />
                    {hit.faculty ??
                      `${hit.entry.city}${hit.entry.governorate ? `, ${hit.entry.governorate}` : ""}`}
                  </span>
                </span>
                <ArrowRight
                  className={cn(
                    "size-4 shrink-0 text-[#1E6DEB] transition-opacity rtl:rotate-180",
                    index === active ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              </li>
            ))}
          </ul>
          <p className="border-t border-slate-100 bg-[#FAFBFE] px-4 py-2 text-[11px] font-medium text-[#98A0B4]">
            {t("quickSearch.suggestionsHint")}
          </p>
        </div>
      ) : null}

      {/* Shortcuts for the most common searches. */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        <span className="text-xs font-semibold text-[#5a6072]">
          {t("hero.popularLabel")}
        </span>
        {popular.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => searchFor(term)}
            className="rounded-full border border-[#CFE0FB] bg-[#EEF4FF] px-3 py-1 text-xs font-semibold text-[#1E4FB8] transition-colors hover:border-[#1E6DEB] hover:bg-[#1E6DEB] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
