"use client";

import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

const DEBOUNCE_MS = 350;

export function TableToolbar({
  children,
  searchKey = "q",
  placeholder,
  total,
  totalLabel,
}: {
  children?: React.ReactNode;
  searchKey?: string;
  placeholder?: string;
  total?: number;
  totalLabel?: string;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const committed = searchParams.get(searchKey) ?? "";
  const [value, setValue] = useState(committed);

  const commit = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set(searchKey, next);
      } else {
        params.delete(searchKey);
      }
      // A different query means the old offset points at nothing.
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchKey, searchParams],
  );

  // Follows the URL when it changes from outside the input — the back button,
  // or a filter control in `children` rewriting the query. Adjusted during
  // render, which is the supported way to reset state from a changing input
  // without a second paint.
  const [lastCommitted, setLastCommitted] = useState(committed);
  if (committed !== lastCommitted) {
    setLastCommitted(committed);
    setValue(committed);
  }

  useEffect(() => {
    if (value === committed) return;
    const timer = window.setTimeout(() => commit(value), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [value, committed, commit]);

  const label = placeholder ?? t("common.search");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search
          aria-hidden
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={label}
          aria-label={label}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white ps-9 pe-9 text-[14px] text-[#0F172A] transition-colors placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              setValue("");
              commit("");
            }}
            aria-label={t("common.clear")}
            className="absolute end-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {total != null ? (
        <p className="text-[13px] text-[#64748B]">
          {formatNumber(locale, total)} {totalLabel ?? t("common.results")}
        </p>
      ) : null}

      {children ? (
        <div className="flex flex-wrap items-center gap-2 sm:ms-auto">{children}</div>
      ) : null}
    </div>
  );
}
