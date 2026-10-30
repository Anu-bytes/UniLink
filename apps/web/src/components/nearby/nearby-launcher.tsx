"use client";

import { ArrowRight, LocateFixed, Lock, MapPin, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { DistanceControl, FieldList, Segmented } from "@/components/nearby/nearby-controls";
import { useRouter } from "@/i18n/navigation";
import type { NearbyField } from "@/lib/nearby";
import { nearbyHref, type NearbyFilters, type NearbyLevel } from "@/lib/nearby-filters";
import { cn } from "@/lib/utils";

const EMPTY: NearbyFilters = { field: null, level: null, type: null, radius: null, start: "locate" };

/**
 * The "Find nearest" button and the form behind it. Submitting opens /nearby
 * with the choices in the URL (never the visitor's location).
 */
export function NearbyLauncher({
  fields,
  initial = EMPTY,
  variant = "hero",
  open: controlledOpen,
  onOpenChange,
  onApply,
  notice,
  guest = false,
}: {
  fields: NearbyField[];
  /** Kept for callers; study level is no longer offered as a filter. */
  levels?: NearbyLevel[];
  initial?: NearbyFilters;
  variant?: "hero" | "cta" | "none";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Apply in place (the map page) instead of navigating to /nearby. */
  onApply?: (filters: NearbyFilters) => void;
  /** A line above the dialog's buttons (a guest's search allowance). */
  notice?: string;
  /** Not signed in: the search starts on the server, which counts the free one. */
  guest?: boolean;
}) {
  const t = useTranslations("Nearby");
  const locale = useLocale();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [ownOpen, setOwnOpen] = useState(false);
  const open = controlledOpen ?? ownOpen;
  const setOpen = (next: boolean) => {
    setOwnOpen(next);
    onOpenChange?.(next);
  };
  const [filters, setFilters] = useState<NearbyFilters>(initial);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setFilters(initial);
      setSubmitting(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    // `initial` is read only when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function update<K extends keyof NearbyFilters>(key: K, value: NearbyFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (onApply) {
      setOpen(false);
      onApply(filters);
      return;
    }
    setSubmitting(true);
    if (guest) {
      const query = nearbyHref(filters).split("?")[1];
      // A route handler, not a page: it must be a full request so its cookie is set.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/api/nearby/start?locale=${locale}${query ? `&${query}` : ""}`);
    } else {
      router.push(nearbyHref(filters));
    }
  }

  return (
    <>
      {variant === "hero" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white ps-3 pe-4 text-sm font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-[border-color,color,box-shadow] hover:border-[#1E6DEB]/40 hover:text-[#1E6DEB] hover:shadow-[0_4px_14px_-6px_rgba(30,109,235,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          <LocateFixed className="size-4 text-[#1E6DEB]" aria-hidden />
          {t("launcher.button")}
          <ArrowRight className="size-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1E6DEB] rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </button>
      ) : variant === "cta" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#1E6DEB] ps-5 pe-6 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.1),0_8px_20px_-8px_rgba(30,109,235,0.7)] transition-[background-color,box-shadow,transform] hover:bg-[#1857C4] hover:shadow-[0_1px_2px_rgba(15,23,42,0.1),0_12px_24px_-8px_rgba(30,109,235,0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:scale-[0.98]"
        >
          <LocateFixed className="size-[18px]" aria-hidden />
          {t("launcher.button")}
          <ArrowRight className="size-4 opacity-70 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </button>
      ) : null}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> itself.
          if (event.target === event.currentTarget) setOpen(false);
        }}
        aria-labelledby="nearby-dialog-title"
        className="ul-nearby-dialog m-auto max-h-[min(780px,calc(100dvh-2rem))] w-[min(560px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl bg-white p-0 text-start text-slate-900 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.05)] backdrop:bg-slate-900/40"
      >
        <form onSubmit={submit} className="flex max-h-[inherit] flex-col">
          <header className="flex items-start gap-4 px-6 pb-4 pt-5">
            <div className="min-w-0 flex-1">
              <h2 id="nearby-dialog-title" className="text-lg font-semibold tracking-tight text-slate-900">
                {t("launcher.title")}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">{t("launcher.subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-me-2 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#1E6DEB]"
            >
              <X className="size-[18px]" aria-hidden />
              <span className="sr-only">{t("launcher.close")}</span>
            </button>
          </header>

          <div className="ul-thin-scroll min-h-0 flex-1 space-y-5 overflow-y-auto border-y border-slate-100 px-6 py-5">
            <section>
              <h3 className="mb-2 text-[13px] font-medium text-slate-700">{t("controls.field")}</h3>
              <FieldList fields={fields} value={filters.field} onChange={(value) => update("field", value)} className="h-[232px]" />
            </section>

            <section>
                <h3 className="mb-2 text-[13px] font-medium text-slate-700">{t("controls.type")}</h3>
                <Segmented
                  label={t("controls.type")}
                  options={[
                    { value: "ANY", label: t("controls.any") },
                    { value: "PRIVATE", label: t("types.PRIVATE") },
                    { value: "NATIONAL", label: t("types.NATIONAL") },
                  ]}
                  value={filters.type ?? "ANY"}
                  onChange={(value) => update("type", value === "ANY" ? null : (value as "PRIVATE" | "NATIONAL"))}
                />
            </section>

            <section>
              <h3 className="mb-2 text-[13px] font-medium text-slate-700">{t("controls.distance")}</h3>
              <DistanceControl value={filters.radius} onChange={(value) => update("radius", value)} />
            </section>

            <section>
              <h3 className="mb-2 text-[13px] font-medium text-slate-700">{t("controls.start")}</h3>
              <Segmented
                label={t("controls.start")}
                options={[
                  { value: "locate", label: t("controls.startLocate"), icon: <LocateFixed className="size-3.5" aria-hidden /> },
                  { value: "pick", label: t("controls.startPick"), icon: <MapPin className="size-3.5" aria-hidden /> },
                ]}
                value={filters.start}
                onChange={(value) => update("start", value)}
              />
              <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                <Lock className="mt-0.5 size-3 shrink-0" aria-hidden />
                {t("privacy")}
              </p>
            </section>
          </div>

          {notice ? <p className="bg-slate-50 px-6 pt-3 text-xs text-slate-500">{notice}</p> : null}
          <footer className="flex items-center justify-between gap-3 bg-slate-50 px-6 py-3.5">
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="rounded-md px-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              {t("launcher.reset")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg bg-[#1E6DEB] px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.1)] transition-colors hover:bg-[#1857C4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:opacity-70",
              )}
            >
              {submitting ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden /> : null}
              {t("launcher.submit")}
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
