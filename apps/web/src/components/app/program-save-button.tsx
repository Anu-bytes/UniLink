"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import {
  toggleProgramSaved,
  useSavedPrograms,
} from "@/components/app/saved-programs-store";
import { cn } from "@/lib/utils";

/**
 * Save toggle for a program. `icon` is the round heart for cards; `button` is
 * the labelled one for the program page and dialog, sized to sit beside the
 * Compare button. Also shown on public pages, so a guest is sent to log in
 * and lands back where they were.
 */
export function ProgramSaveButton({
  programId,
  variant,
  className,
}: {
  programId: string;
  variant: "icon" | "button";
  className?: string;
}) {
  const t = useTranslations("Saved");
  const router = useRouter();
  const pathname = usePathname();
  const { status, signedIn, ids } = useSavedPrograms();
  const saved = ids.has(programId);
  const label = saved ? t("savedProgram") : t("saveProgram");

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (status !== "ready") return;
    if (!signedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    void toggleProgramSaved(programId);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:scale-90",
          saved
            ? "border-[#F82C1F] bg-[#F82C1F] text-white"
            : "border-slate-200 bg-white text-[#F82C1F] hover:bg-[#FFF0EE]",
          className,
        )}
      >
        <Heart
          className={cn("size-4", saved && "fill-current ul-heart-pop")}
          aria-hidden
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
        saved
          ? "border-[#F82C1F] bg-[#FFF0EE] text-[#F82C1F]"
          : "border-slate-200 bg-white text-[#F82C1F] hover:bg-[#FFF0EE]",
        className,
      )}
    >
      <Heart className={cn("size-5", saved && "fill-current")} aria-hidden />
      {label}
    </button>
  );
}
