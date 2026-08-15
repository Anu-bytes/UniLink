"use client";

import { Lock, Search, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";

/**
 * The quick university search above "Featured Universities". Signed-out
 * visitors get a real search box that jumps to the public directory; signed-in
 * students already have the full AI-powered search in the app, so the box is
 * shown blurred with a CTA over it pointing there instead of duplicating it.
 */
export function HomeSearchBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const t = useTranslations("Home.landing.quickSearch");
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(`/universities${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <div className="relative mx-auto max-w-2xl">
      <form
        onSubmit={submit}
        aria-hidden={isAuthenticated}
        inert={isAuthenticated ? true : undefined}
        className={`flex items-center gap-1.5 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.35)] ring-1 ring-black/5 transition-colors focus-within:ring-2 focus-within:ring-[#1E6DEB] ${
          isAuthenticated ? "pointer-events-none select-none blur-[3px]" : ""
        }`}
      >
        <span className="ms-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]">
          <Search className="size-4" aria-hidden />
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
  );
}
