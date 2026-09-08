"use client";

import type { ApplicationStatus } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { APPLICATION_STATUSES } from "./types";

const CHIP =
  "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]";

const CHIP_ACTIVE = "border-[#1E6DEB] bg-[#EAF2FE] text-[#1E6DEB]";
const CHIP_IDLE =
  "border-slate-200 bg-white text-[#334155] hover:bg-slate-50 hover:text-[#0F172A]";

/**
 * `counts` arrives zero-filled and covers every status regardless of which one
 * is selected — the same thing the list endpoint does with `?counts=true`. A
 * chip that disappeared because nobody has reached that status yet reads as a
 * bug, and counts that collapsed to the current filter would make every other
 * chip say zero.
 */
export function StatusChips({
  counts,
  total,
}: {
  counts: Record<ApplicationStatus, number>;
  total: number;
}) {
  const t = useTranslations("Admin.applications");
  const tStatus = useTranslations("Applications.status");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = searchParams.get("status") ?? "";

  function select(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    // A narrower board has fewer pages, so the offset the admin was on would
    // land them past the end of the filtered result.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div
      role="group"
      aria-label={t("statusFilter.label")}
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        aria-pressed={active === ""}
        onClick={() => select("")}
        className={cn(CHIP, active === "" ? CHIP_ACTIVE : CHIP_IDLE)}
      >
        {t("statusFilter.all")}
        <span className="tabular-nums font-normal opacity-70">
          {formatNumber(locale, total)}
        </span>
      </button>

      {APPLICATION_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          aria-pressed={active === status}
          onClick={() => select(status)}
          className={cn(CHIP, active === status ? CHIP_ACTIVE : CHIP_IDLE)}
        >
          {tStatus(status)}
          <span className="tabular-nums font-normal opacity-70">
            {formatNumber(locale, counts[status])}
          </span>
        </button>
      ))}
    </div>
  );
}
