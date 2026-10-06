"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import {
  toggleUniversitySaved,
  useSavedUniversities,
} from "@/components/app/saved-universities-store";
import { cn } from "@/lib/utils";

/**
 * Heart toggle that sits beside a university card's compare button. Saves
 * to the visitor's Saved page; a guest is sent to log in first and lands
 * back on the same page. Sits as a sibling of a stretched card link (not
 * inside it), so it stops the click from also opening the card.
 */
export function UniversitySaveToggle({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const t = useTranslations("UniversityDetail");
  const router = useRouter();
  const pathname = usePathname();
  const { status, signedIn, ids } = useSavedUniversities();
  const saved = ids.has(id);
  const label = saved ? t("saved") : t("save");

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (status !== "ready") return;
        if (!signedIn) {
          router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          return;
        }
        void toggleUniversitySaved(id);
      }}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={cn(
        "relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full shadow-md ring-1 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:scale-90",
        saved
          ? "bg-[#F82C1F] text-white ring-[#F82C1F]"
          : "bg-white/95 text-[#F82C1F] ring-black/5 backdrop-blur hover:bg-white",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform", saved && "fill-current ul-heart-pop")}
        aria-hidden
      />
    </button>
  );
}
