"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, GraduationCap, Layers, X } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { pick } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { SearchHit } from "@/lib/types";

const ICONS = {
  university: Building2,
  program: GraduationCap,
  field: Layers,
} as const;

export function SearchBar({
  variant = "hero",
  initialQuery = "",
  className,
}: {
  variant?: "hero" | "compact";
  initialQuery?: string;
  className?: string;
}) {
  const { locale, m } = useIntl();
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete (SRS FR-SR-04: ~300ms).
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/autocomplete?q=${encodeURIComponent(term)}&lang=${locale}`,
          { signal: ctrl.signal },
        );
        const json = await res.json();
        setHits(json.suggestions ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        /* aborted */
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, locale]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(`/${locale}${href}`);
  }

  function submit() {
    if (active >= 0 && hits[active]) return go(hits[active].href);
    go(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const big = variant === "hero";

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-[14px] border bg-surface shadow-sm",
          big ? "h-14 px-4" : "h-11 px-3",
          "border-line focus-within:border-brand",
        )}
      >
        <Search className={cn("shrink-0 text-muted", big ? "size-5" : "size-4")} aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => hits.length && setOpen(true)}
          placeholder={m.hero.searchPlaceholder}
          aria-label={m.common.search}
          className={cn(
            "w-full bg-transparent outline-none placeholder:text-muted",
            big ? "text-base" : "text-sm",
          )}
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setHits([]);
            }}
            aria-label={m.common.clearAll}
            className="text-muted hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
        {big && (
          <button
            type="button"
            onClick={submit}
            className="hidden h-10 items-center rounded-[10px] bg-brand px-5 text-sm font-medium text-white hover:bg-brand-600 sm:inline-flex"
          >
            {m.common.search}
          </button>
        )}
      </div>

      {open && hits.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-[14px] border border-line bg-surface py-1 shadow-lg"
        >
          {hits.map((hit, i) => {
            const Icon = ICONS[hit.type];
            return (
              <li key={`${hit.type}-${hit.id}`}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(hit.href)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-start",
                    active === i ? "bg-brand-50" : "hover:bg-brand-50",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">
                      {pick(hit.title, locale)}
                    </span>
                    {hit.subtitle && (
                      <span className="block truncate text-xs text-muted">
                        {pick(hit.subtitle, locale)}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
