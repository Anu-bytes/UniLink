"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Uses the Web Share sheet where the browser has one, and falls back to
 * copying the current URL to the clipboard.
 *
 * `labelOnMobile` shows the text label below the sm breakpoint, where the
 * button sits in an equal-width row with other labelled actions; from sm up
 * it collapses back to a square icon button.
 */
export function ShareButton({
  title,
  label,
  copiedLabel,
  labelOnMobile = false,
}: {
  title: string;
  label: string;
  copiedLabel: string;
  labelOnMobile?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // The user dismissed the sheet, or sharing is blocked; fall through to
        // copying so the button still does something useful.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to share this page", error);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
      className={cn(
        "flex items-center justify-center rounded-xl border border-slate-200 bg-white text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
        labelOnMobile
          ? "h-12 w-full gap-1.5 px-2 text-sm font-bold sm:size-12 sm:px-0"
          : "size-12",
      )}
    >
      {copied ? (
        <Check className="size-5 shrink-0" aria-hidden />
      ) : (
        <Share2 className="size-5 shrink-0" aria-hidden />
      )}
      {labelOnMobile ? (
        <span aria-hidden className="truncate sm:hidden">
          {copied ? copiedLabel : label}
        </span>
      ) : null}
    </button>
  );
}
