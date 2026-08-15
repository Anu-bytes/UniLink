"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useSavedCount } from "@/components/app/saved-context";
import { cn } from "@/lib/utils";

/**
 * Save toggle for a faculty card. Split out as its own client component so
 * FacultyCard can stay a server component and keep rendering translated
 * content without shipping the whole card to the browser.
 */
export function FacultySaveButton({
  facultyId,
  initialSaved,
}: {
  facultyId: string;
  initialSaved: boolean;
}) {
  const t = useTranslations("FacultySearch");
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const savedCount = useSavedCount();

  async function toggleSaved() {
    const next = !saved;
    setSaved(next);
    if (next) savedCount.increment();
    else savedCount.decrement();
    setPending(true);
    try {
      const response = await fetch("/api/saved", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facultyId }),
      });
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      console.error("Unable to update saved faculties", error);
      setSaved(!next);
      if (next) savedCount.decrement();
      else savedCount.increment();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={pending}
      aria-pressed={saved}
      className={cn(
        "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-70",
        saved
          ? "border-[#F82C1F] bg-[#FFF0EE] text-[#F82C1F]"
          : "border-slate-200 text-[#1F2A44] hover:bg-slate-50",
      )}
    >
      <Heart className={cn("size-4", saved && "fill-current")} aria-hidden />
      {saved ? t("saved") : t("save")}
    </button>
  );
}
