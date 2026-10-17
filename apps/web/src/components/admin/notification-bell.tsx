"use client";

import { Bell, ClipboardCheck, Presentation, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";

export type BellRequest = {
  id: string;
  type: "DEMO" | "REPRESENTATIVE";
  universityName: string;
  fullName: string;
  createdAt: string;
};

/**
 * The console header's bell: new demo requests and representative
 * applications, and the changes waiting for review. The counts come from the
 * layout, so they refresh on every full navigation and after each action
 * (router.refresh re-renders the layout).
 */
export function NotificationBell({
  requests,
  newRequests,
  pendingChanges,
}: {
  requests: BellRequest[];
  newRequests: number;
  pendingChanges: number;
}) {
  const t = useTranslations("Admin.notifications");
  const locale = useLocale();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const total = newRequests + pendingChanges;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpenAt(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenAt(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const time = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpenAt(open ? null : pathname)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={total ? t("labelCount", { count: total }) : t("label")}
        className="relative flex size-10 items-center justify-center rounded-lg text-[#475569] transition-colors hover:bg-slate-50 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      >
        <Bell className="size-5" aria-hidden />
        {total > 0 ? (
          <span aria-hidden className="absolute end-1 top-1 min-w-4 rounded-full bg-[#F82C1F] px-1 text-center text-[10px] leading-4 font-bold text-white">
            {total > 99 ? "99+" : total}
          </span>
        ) : null}
      </button>

      {open ? (
        <div role="menu" className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white shadow-xl">
          <p className="border-b border-slate-100 px-4 py-3 text-[13.5px] font-semibold text-[#0F172A]">{t("title")}</p>
          <div className="max-h-[60vh] overflow-y-auto p-1.5">
            {pendingChanges > 0 ? (
              <Link
                href="/admin/approvals"
                role="menuitem"
                onClick={() => setOpenAt(null)}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF6E5] text-[#B77714]">
                  <ClipboardCheck className="size-4" aria-hidden />
                </span>
                <span className="text-[13px] leading-5 text-[#334155]">{t("pendingChanges", { count: pendingChanges })}</span>
              </Link>
            ) : null}
            {requests.map((request) => (
              <Link
                key={request.id}
                href={`/admin/requests/${request.id}`}
                role="menuitem"
                onClick={() => setOpenAt(null)}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#1E6DEB]">
                  {request.type === "DEMO" ? <Presentation className="size-4" aria-hidden /> : <ShieldCheck className="size-4" aria-hidden />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-5 text-[#0F172A]">
                    {t(request.type === "DEMO" ? "newDemo" : "newRepresentative")}
                  </span>
                  <span className="block truncate text-[12.5px] text-[#64748B]">
                    <bdi>{request.universityName}</bdi> · <bdi>{request.fullName}</bdi>
                  </span>
                  <span className="block text-[11.5px] text-[#94A3B8]">{time.format(new Date(request.createdAt))}</span>
                </span>
              </Link>
            ))}
            {total === 0 ? <p className="px-3 py-6 text-center text-[13px] text-[#64748B]">{t("empty")}</p> : null}
          </div>
          <Link
            href="/admin/requests"
            onClick={() => setOpenAt(null)}
            className="block border-t border-slate-100 px-4 py-2.5 text-center text-[13px] font-semibold text-[#1E6DEB] hover:bg-slate-50"
          >
            {newRequests > requests.length ? t("seeAllCount", { count: newRequests }) : t("seeAll")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
