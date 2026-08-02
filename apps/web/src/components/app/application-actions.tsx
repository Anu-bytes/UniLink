"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/** Submit a draft, or withdraw anything that is still open. */
export function ApplicationStatusActions({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const t = useTranslations("Applications");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const closed = status === "WITHDRAWN" || status === "REJECTED";
  if (closed) return null;

  function update(next: "SUBMITTED" | "WITHDRAWN") {
    startTransition(async () => {
      try {
        const response = await fetch("/api/applications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId, status: next }),
        });
        if (!response.ok) throw new Error(await response.text());
        router.refresh();
      } catch (error) {
        console.error("Unable to update this application", error);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status === "DRAFT" ? (
        <button
          type="button"
          onClick={() => update("SUBMITTED")}
          disabled={isPending}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1E6DEB] px-4 text-sm font-bold text-white hover:bg-[#1859c4] disabled:opacity-70"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {t("status.SUBMITTED")}
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => update("WITHDRAWN")}
        disabled={isPending}
        className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-[#C81F15] hover:bg-[#FFF0EE] disabled:opacity-70"
      >
        {t("withdraw")}
      </button>
    </div>
  );
}
