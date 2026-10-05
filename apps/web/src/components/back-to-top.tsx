"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Floating "back to top" button for long pages on desktop (phones have the
 * tab bar instead). Appears after scrolling past the first couple of
 * screens and glides back up on click.
 */
export function BackToTop() {
  const t = useTranslations("Common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setVisible(window.scrollY > window.innerHeight * 1.5);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      }}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      tabIndex={visible ? undefined : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-6 end-6 z-30 hidden size-12 items-center justify-center rounded-full bg-white text-[#1E6DEB] shadow-[0_14px_34px_-12px_rgba(15,23,42,0.45)] ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1E6DEB] hover:text-white lg:flex",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
