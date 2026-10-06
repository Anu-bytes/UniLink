"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import { setUniversitySaved } from "@/components/app/saved-universities-store";
import { cn } from "@/lib/utils";

/**
 * The heart on a university profile (mirrors FacultySaveButton, one level up
 * the hierarchy). Rendered on the public profile page, so unlike
 * FacultySaveButton it has to handle a signed-out visitor itself: there is no
 * session to toggle against, so a click sends them to log in instead, with
 * this page as the callback.
 */
export function UniversityLikeButton({
  universityId,
  isAuthenticated,
  initialLiked,
  likeLabel,
  likedLabel,
  callbackUrl,
  className,
}: {
  universityId: string;
  isAuthenticated: boolean;
  initialLiked: boolean;
  likeLabel: string;
  likedLabel: string;
  callbackUrl: string;
  className?: string;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [pending, setPending] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        aria-label={likeLabel}
        title={likeLabel}
        className={cn(
          "flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-base font-bold text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
          className,
        )}
      >
        <Heart className="size-5" aria-hidden />
        {likeLabel}
      </Link>
    );
  }

  async function toggleLiked() {
    const next = !liked;
    setLiked(next);
    setPending(true);
    try {
      const response = await fetch("/api/saved-universities", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityId }),
      });
      if (!response.ok) throw new Error(await response.text());
      // Keep any card hearts elsewhere on the page in step.
      setUniversitySaved(universityId, next);
      // The header's saved-faculties count and any "Saved" list elsewhere
      // read from a server component, so they need a fresh render to notice.
      router.refresh();
    } catch (error) {
      console.error("Unable to update saved universities", error);
      setLiked(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleLiked}
      disabled={pending}
      aria-pressed={liked}
      title={liked ? likedLabel : likeLabel}
      className={cn(
        "flex min-h-12 items-center justify-center gap-2 rounded-xl border text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-70",
        liked
          ? "border-[#F82C1F] bg-[#FFF0EE] text-[#F82C1F]"
          : "border-slate-200 bg-white text-[#1E6DEB] hover:bg-[#EEF3FF]",
        className,
      )}
    >
      <Heart className={cn("size-5", liked && "fill-current")} aria-hidden />
      {liked ? likedLabel : likeLabel}
    </button>
  );
}
