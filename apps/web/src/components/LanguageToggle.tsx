"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useIntl } from "@/i18n/provider";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, m } = useIntl();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "ar" ? "en" : "ar";

  function switchLocale() {
    const rest = pathname.replace(/^\/(en|ar)/, "");
    const search = typeof window !== "undefined" ? window.location.search : "";
    document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000`;
    router.push(`/${other}${rest}${search}`);
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className={
        "inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 text-sm font-medium text-ink hover:bg-brand-50 " +
        (className ?? "")
      }
      aria-label="Switch language"
    >
      <Languages className="size-4" aria-hidden />
      {m.nav.language}
    </button>
  );
}
