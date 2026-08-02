"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

/**
 * Uses the Web Share sheet where the browser has one, and falls back to
 * copying the current URL to the clipboard.
 */
export function ShareButton({
  title,
  label,
  copiedLabel,
}: {
  title: string;
  label: string;
  copiedLabel: string;
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
      className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
    >
      {copied ? (
        <Check className="size-5" aria-hidden />
      ) : (
        <Share2 className="size-5" aria-hidden />
      )}
    </button>
  );
}
