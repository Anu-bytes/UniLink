"use client";

import {
  ArrowRight,
  Building2,
  CornerDownLeft,
  Flame,
  GraduationCap,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { useRouter } from "@/i18n/navigation";
import { UniversityLogo } from "@/components/university-logo";
import {
  highlightParts,
  searchUniversities,
  useUniversityIndex,
  type UniversitySearchEntry,
} from "@/components/search/university-search";
import { cn } from "@/lib/utils";

type PaletteItem =
  | { kind: "university"; key: string; href: string; entry: UniversitySearchEntry; faculty: string | null }
  | { kind: "link"; key: string; href: string; label: string; hint: string; icon: typeof Search };

const noopSubscribe = () => () => {};

/**
 * Site-wide instant search ("command palette"). Opens from the header
 * trigger, Ctrl/Cmd+K, or "/" anywhere outside a text field, and searches
 * every published university by name (either language), acronym, district,
 * governorate or faculty as you type, with full keyboard control.
 */
export function SearchPalette({ signedIn }: { signedIn: boolean }) {
  const t = useTranslations("Palette");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  // Fetch the index as soon as the trigger is hovered or focused, so the
  // first keystroke already has data.
  const [warm, setWarm] = useState(false);
  const { entries, loading, failed } = useUniversityIndex(locale, warm || open);

  // Server render (and hydration) assume "Ctrl K"; the real platform is
  // read on the client without a mismatch.
  const isMac = useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );

  // --- open / close -------------------------------------------------------
  const show = useCallback(() => {
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) setOpen(false);
        else show();
        return;
      }
      if (event.key === "/" && !open) {
        const target = event.target as HTMLElement | null;
        const typing =
          target &&
          (target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
        if (!typing) {
          event.preventDefault();
          show();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, show]);

  // --- items --------------------------------------------------------------
  const trimmed = query.trim();
  const items = useMemo<PaletteItem[]>(() => {
    if (trimmed) {
      const hits = entries ? searchUniversities(entries, trimmed, 7) : [];
      return [
        ...hits.map((hit) => ({
          kind: "university" as const,
          key: hit.entry.slug,
          href: `/universities/${hit.entry.slug}`,
          entry: hit.entry,
          faculty: hit.faculty,
        })),
        {
          kind: "link" as const,
          key: "see-all",
          href: `/universities?q=${encodeURIComponent(trimmed)}`,
          label: t("seeAll", { query: trimmed }),
          hint: t("seeAllHint"),
          icon: Search,
        },
      ];
    }
    const trending = (entries ?? []).slice(0, 5).map((entry) => ({
      kind: "university" as const,
      key: entry.slug,
      href: `/universities/${entry.slug}`,
      entry,
      faculty: null,
    }));
    return [
      ...trending,
      {
        kind: "link" as const,
        key: "all",
        href: "/universities",
        label: t("browseAll"),
        hint: t("browseAllHint"),
        icon: Building2,
      },
      {
        kind: "link" as const,
        key: "smart",
        href: signedIn ? "/app/search" : "/onboarding",
        label: t("smartSearch"),
        hint: t("smartSearchHint"),
        icon: Sparkles,
      },
      {
        kind: "link" as const,
        key: "students",
        href: "/students",
        label: t("students"),
        hint: t("studentsHint"),
        icon: Users,
      },
    ];
  }, [entries, signedIn, t, trimmed]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (items.length ? (index + 1) % items.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (items.length ? (index - 1 + items.length) % items.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = items[active];
      if (item) go(item.href);
    }
  }

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const universityCount = items.filter((item) => item.kind === "university").length;
  const showEmpty = Boolean(trimmed) && entries && universityCount === 0;

  return (
    <>
      {/* A plain button labelled "Quick search". The keyboard shortcut still
          works and is shown as the tooltip. */}
      <button
        type="button"
        onClick={show}
        onMouseEnter={() => setWarm(true)}
        onFocus={() => setWarm(true)}
        aria-haspopup="dialog"
        title={`${t("trigger")} (${isMac ? "⌘K" : "Ctrl+K"})`}
        className="group inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[#EEF4FF] px-3.5 lg:max-xl:px-3 text-sm font-bold text-[#1E6DEB] transition-all hover:-translate-y-0.5 hover:bg-[#1E6DEB] hover:text-white hover:shadow-[0_10px_24px_-10px_rgba(30,109,235,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 md:h-11 md:px-4 md:text-[15px]"
      >
        <Search className="size-4 shrink-0 transition-transform group-hover:scale-110 md:size-[18px]" aria-hidden />
        {/* Icon-only in the 1024-1279px range, where the full desktop header
            (links, language, both account buttons) has no room for the
            label; labelled everywhere else. */}
        <span className="lg:max-xl:sr-only">{t("trigger")}</span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        aria-label={t("open")}
        className="ul-palette mx-auto mb-auto mt-[8vh] w-[min(calc(100vw-1.5rem),40rem)] overflow-hidden rounded-3xl border-0 bg-white p-0 text-[#1F2A44] shadow-[0_40px_120px_-20px_rgba(15,23,42,0.55)] ring-1 ring-black/5 backdrop:bg-[#0B1B3A]/45 backdrop:backdrop-blur-md md:mt-[12vh]"
      >
        {open ? (
          <div className="flex max-h-[min(78vh,40rem)] flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 md:px-5">
              {loading ? (
                <Loader2 className="size-5 shrink-0 animate-spin text-[#1E6DEB]" aria-hidden />
              ) : (
                <Search className="size-5 shrink-0 text-[#1E6DEB]" aria-hidden />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-results"
                aria-activedescendant={items[active] ? `palette-item-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
                className="h-11 min-w-0 flex-1 bg-transparent text-base text-[#1F2A44] outline-none placeholder:text-[#98A0B4] md:text-[17px]"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] font-semibold text-[#98A0B4] hover:text-[#1F2A44]"
              >
                Esc
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 md:px-3">
              {failed ? (
                <p className="px-3 py-8 text-center text-sm text-[#5a6072]">{t("error")}</p>
              ) : null}

              {!trimmed && entries ? (
                <p className="flex items-center gap-1.5 px-3 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-wider text-[#98A0B4]">
                  <Flame className="size-3.5 text-[#F82C1F]" aria-hidden />
                  {t("trending")}
                </p>
              ) : null}

              {showEmpty ? (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm font-semibold text-[#1F2A44]">
                    {t("noResults", { query: trimmed })}
                  </p>
                  <p className="mt-1 text-xs text-[#5a6072]">{t("noResultsHint")}</p>
                </div>
              ) : null}

              <ul ref={listRef} id="palette-results" role="listbox" className="space-y-0.5">
                {items.map((item, index) => {
                  const selected = index === active;
                  const firstLink =
                    item.kind === "link" && (index === 0 || items[index - 1]?.kind !== "link");
                  return (
                    <li key={item.key} role="presentation">
                      {firstLink && !trimmed ? (
                        <p className="px-3 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-wider text-[#98A0B4]">
                          {t("quickLinks")}
                        </p>
                      ) : null}
                      <div
                        id={`palette-item-${index}`}
                        role="option"
                        aria-selected={selected}
                        data-index={index}
                        onMouseMove={() => setActive(index)}
                        onClick={() => go(item.href)}
                        className={cn(
                          "ul-palette-row flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
                          selected ? "bg-[#EEF4FF]" : "hover:bg-slate-50",
                        )}
                        style={{ animationDelay: `${Math.min(index, 8) * 22}ms` }}
                      >
                        {item.kind === "university" ? (
                          <>
                            <UniversityLogo
                              name={item.entry.name}
                              logoUrl={item.entry.logoUrl}
                              className="size-10 shrink-0 ring-1 ring-slate-200"
                              textClassName="text-xs"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="flex items-center gap-2">
                                <span className="truncate text-[15px] font-semibold text-[#16233F]">
                                  {highlightParts(item.entry.name, trimmed).map((part, i) =>
                                    part.hit ? (
                                      <mark key={i} className="rounded bg-[#FFE7A3] px-0.5 text-inherit">
                                        {part.text}
                                      </mark>
                                    ) : (
                                      <span key={i}>{part.text}</span>
                                    ),
                                  )}
                                </span>
                                {item.entry.acronym ? (
                                  <span
                                    dir="ltr"
                                    className="shrink-0 rounded-md bg-[#1E6DEB]/10 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-[#1E6DEB]"
                                  >
                                    {item.entry.acronym}
                                  </span>
                                ) : null}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#5a6072]">
                                <MapPin className="size-3 shrink-0 text-[#1E6DEB]" aria-hidden />
                                <span className="truncate">
                                  {item.entry.city}
                                  {item.entry.governorate ? `, ${item.entry.governorate}` : ""}
                                  {" · "}
                                  {tCatalog(`universityTypes.${item.entry.type}`)}
                                </span>
                              </p>
                              {item.faculty ? (
                                <p className="mt-1 inline-flex max-w-full items-center gap-1 rounded-full bg-[#ECFDF3] px-2 py-0.5 text-[11px] font-semibold text-[#1F7A4D]">
                                  <GraduationCap className="size-3 shrink-0" aria-hidden />
                                  <span className="truncate">{item.faculty}</span>
                                </p>
                              ) : null}
                            </div>
                            <span className="hidden shrink-0 text-xs font-semibold text-[#98A0B4] sm:inline">
                              {t("programs", { count: item.entry.programCount })}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white shadow-sm">
                              <item.icon className="size-[18px]" aria-hidden />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[15px] font-semibold text-[#16233F]">
                                {item.label}
                              </p>
                              <p className="truncate text-xs text-[#5a6072]">{item.hint}</p>
                            </div>
                          </>
                        )}
                        <span
                          className={cn(
                            "shrink-0 text-[#1E6DEB] transition-all",
                            selected ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 rtl:translate-x-1",
                          )}
                          aria-hidden
                        >
                          {selected ? (
                            <CornerDownLeft className="size-4" />
                          ) : (
                            <ArrowRight className="size-4 rtl:rotate-180" />
                          )}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="hidden items-center gap-4 border-t border-slate-100 bg-[#FAFBFE] px-5 py-2.5 text-[11px] font-medium text-[#98A0B4] md:flex">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans">↑</kbd>
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans">↓</kbd>
                {t("hintNavigate")}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans">↵</kbd>
                {t("hintOpen")}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans">Esc</kbd>
                {t("hintClose")}
              </span>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
