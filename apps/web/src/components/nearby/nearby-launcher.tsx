"use client";

import {
  ArrowRight,
  Check,
  LocateFixed,
  MapPinned,
  MousePointerClick,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { normalize } from "@/lib/normalize-text";
import type { NearbyField } from "@/lib/nearby";
import { nearbyHref, type NearbyFilters, type NearbyLevel } from "@/lib/nearby-filters";
import { cn } from "@/lib/utils";

const RADII = [10, 25, 50, 100] as const;

const EMPTY: NearbyFilters = { field: null, level: null, type: null, radius: null, start: "locate" };

/**
 * The "Find nearest" button and the dialog of choices behind it. Choosing
 * opens /nearby with the filters in the URL (never the visitor's location).
 */
export function NearbyLauncher({
  fields,
  levels,
  initial = EMPTY,
  variant = "hero",
  open: controlledOpen,
  onOpenChange,
  onApply,
  notice,
  guest = false,
}: {
  fields: NearbyField[];
  levels: NearbyLevel[];
  initial?: NearbyFilters;
  variant?: "hero" | "cta" | "none";
  /** A line above the dialog's buttons (a guest's search allowance). */
  notice?: string;
  /** Not signed in: the search starts on the server, which counts the free one. */
  guest?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Apply in place (the map page) instead of navigating to /nearby. */
  onApply?: (filters: NearbyFilters) => void;
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
  const [fieldQuery, setFieldQuery] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setFilters(initial);
      setFieldQuery("");
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    // `initial` is read only when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const shownFields = useMemo(() => {
    const query = normalize(fieldQuery);
    return query ? fields.filter((field) => normalize(field.label).includes(query)) : fields;
  }, [fields, fieldQuery]);

  function update<K extends keyof NearbyFilters>(key: K, value: NearbyFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
    if (onApply) onApply(filters);
    else if (guest) {
      const query = nearbyHref(filters).split("?")[1];
      window.location.assign(`/api/nearby/start?locale=${locale}${query ? `&${query}` : ""}`);
    } else router.push(nearbyHref(filters));
  }

  const chosenField = fields.find((field) => field.value === filters.field);

  return (
    <>
      {variant === "hero" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative inline-flex min-h-11 items-center gap-2.5 overflow-hidden rounded-full border border-[#CFE0FB] bg-white py-1.5 ps-1.5 pe-4 text-sm font-bold text-[#16233F] shadow-[0_10px_30px_-18px_rgba(30,109,235,0.7)] transition-all hover:-translate-y-0.5 hover:border-[#1E6DEB] hover:shadow-[0_14px_34px_-16px_rgba(30,109,235,0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] motion-reduce:transform-none"
        >
          <span className="relative flex size-8 items-center justify-center rounded-full bg-[#1E6DEB] text-white">
            <span className="ul-nearby-ping absolute inset-0 rounded-full bg-[#1E6DEB]" aria-hidden />
            <LocateFixed className="relative size-4" aria-hidden />
          </span>
          {t("launcher.button")}
          <ArrowRight className="size-4 text-[#1E6DEB] transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </button>
      ) : variant === "cta" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E6DEB] to-[#2F7BF5] ps-2 pe-6 text-base font-bold text-white shadow-[0_18px_36px_-14px_rgba(30,109,235,0.95)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-14px_rgba(30,109,235,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 motion-reduce:transform-none rtl:bg-gradient-to-l"
        >
          <span aria-hidden className="ul-cta-sheen pointer-events-none absolute inset-y-0 -start-1/2 w-1/3 -skew-x-12 bg-white/25" />
          <span className="relative flex size-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <span className="ul-nearby-ping absolute inset-0 rounded-xl bg-white/30" aria-hidden />
            <LocateFixed className="relative size-5" aria-hidden />
          </span>
          <span className="relative">{t("launcher.button")}</span>
          <ArrowRight className="relative size-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
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
        className="ul-nearby-dialog m-auto w-[min(640px,calc(100vw-2rem))] max-h-[min(860px,calc(100dvh-2rem))] overflow-hidden rounded-3xl bg-white p-0 text-start text-[#1F2A44] shadow-[0_40px_90px_-30px_rgba(15,23,42,0.6)] backdrop:bg-[#0B1220]/55 backdrop:backdrop-blur-[2px]"
      >
        <form onSubmit={submit} className="flex max-h-[inherit] flex-col">
          <header className="relative overflow-hidden border-b border-slate-100 px-6 pb-5 pt-6">
            <div className="pointer-events-none absolute -end-16 -top-20 size-56 rounded-full bg-[#1E6DEB]/[0.07]" aria-hidden />
            <div className="pointer-events-none absolute -end-4 -top-8 size-24 rounded-full bg-[#F82C1F]/[0.06]" aria-hidden />
            <div className="relative flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-white shadow-[0_12px_24px_-12px_rgba(30,109,235,0.9)]">
                <MapPinned className="size-6" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="nearby-dialog-title" className="text-xl font-extrabold tracking-tight text-[#16233F]">
                  {t("launcher.title")}
                </h2>
                <p className="mt-1 text-sm text-[#5a6072]">{t("launcher.subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-me-2 -mt-1 flex size-9 items-center justify-center rounded-full text-[#5a6072] transition-colors hover:bg-slate-100 hover:text-[#16233F] focus-visible:outline-2 focus-visible:outline-[#1E6DEB]"
              >
                <X className="size-5" aria-hidden />
                <span className="sr-only">{t("launcher.close")}</span>
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
            <fieldset>
              <legend className="flex w-full items-center justify-between gap-3 text-sm font-bold text-[#16233F]">
                <span>
                  <StepNumber n={1} />
                  {t("launcher.fieldLabel")}
                </span>
                {chosenField ? (
                  <span className="truncate text-xs font-semibold text-[#1E6DEB]">{chosenField.label}</span>
                ) : null}
              </legend>
              <label className="relative mt-3 block">
                <span className="sr-only">{t("launcher.fieldSearch")}</span>
                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#98A0B4]" aria-hidden />
                <input
                  type="text"
                  value={fieldQuery}
                  onChange={(event) => setFieldQuery(event.target.value)}
                  placeholder={t("launcher.fieldSearch")}
                  autoComplete="off"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-[#FAFBFE] ps-9 pe-3 text-sm outline-none transition-colors placeholder:text-[#98A0B4] focus:border-[#1E6DEB] focus:bg-white"
                />
              </label>
              <div className="mt-3 flex max-h-44 flex-wrap gap-2 overflow-y-auto p-0.5">
                {!fieldQuery ? (
                  <Chip selected={filters.field === null} onClick={() => update("field", null)}>
                    {t("launcher.anyField")}
                  </Chip>
                ) : null}
                {shownFields.map((field) => (
                  <Chip
                    key={field.value}
                    selected={filters.field === field.value}
                    onClick={() => update("field", filters.field === field.value ? null : field.value)}
                  >
                    {field.label}
                    <span className={cn("ms-1.5 text-[11px] font-semibold", filters.field === field.value ? "text-white/75" : "text-[#98A0B4]")}>
                      {field.count}
                    </span>
                  </Chip>
                ))}
                {shownFields.length === 0 ? <p className="px-1 py-2 text-sm text-[#98A0B4]">{t("launcher.noField")}</p> : null}
              </div>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <fieldset>
                <legend className="text-sm font-bold text-[#16233F]">
                  <StepNumber n={2} />
                  {t("launcher.levelLabel")}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip selected={filters.level === null} onClick={() => update("level", null)}>
                    {t("launcher.any")}
                  </Chip>
                  {levels.map((level) => (
                    <Chip key={level} selected={filters.level === level} onClick={() => update("level", level)}>
                      {t(`levels.${level}`)}
                    </Chip>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-bold text-[#16233F]">
                  <StepNumber n={3} />
                  {t("launcher.typeLabel")}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip selected={filters.type === null} onClick={() => update("type", null)}>
                    {t("launcher.any")}
                  </Chip>
                  <Chip selected={filters.type === "PRIVATE"} onClick={() => update("type", "PRIVATE")}>
                    {t("types.PRIVATE")}
                  </Chip>
                  <Chip selected={filters.type === "NATIONAL"} onClick={() => update("type", "NATIONAL")}>
                    {t("types.NATIONAL")}
                  </Chip>
                </div>
              </fieldset>
            </div>

            <fieldset>
              <legend className="text-sm font-bold text-[#16233F]">
                <StepNumber n={4} />
                {t("launcher.radiusLabel")}
              </legend>
              <div className="mt-3 grid grid-cols-5 gap-1 rounded-2xl bg-[#F1F5FB] p-1">
                {[null, ...RADII].map((radius) => (
                  <button
                    key={radius ?? "any"}
                    type="button"
                    aria-pressed={filters.radius === radius}
                    onClick={() => update("radius", radius)}
                    className={cn(
                      "h-10 rounded-xl text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-[#1E6DEB]",
                      filters.radius === radius
                        ? "bg-white text-[#1E6DEB] shadow-[0_4px_12px_-6px_rgba(30,109,235,0.6)]"
                        : "text-[#5a6072] hover:text-[#16233F]",
                    )}
                  >
                    {radius === null ? t("launcher.anyDistance") : t("km", { value: radius })}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-[#16233F]">
                <StepNumber n={5} />
                {t("launcher.startLabel")}
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <StartOption
                  selected={filters.start === "locate"}
                  onClick={() => update("start", "locate")}
                  icon={<LocateFixed className="size-5" aria-hidden />}
                  title={t("launcher.startLocate")}
                  hint={t("launcher.startLocateHint")}
                />
                <StartOption
                  selected={filters.start === "pick"}
                  onClick={() => update("start", "pick")}
                  icon={<MousePointerClick className="size-5" aria-hidden />}
                  title={t("launcher.startPick")}
                  hint={t("launcher.startPickHint")}
                />
              </div>
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#EEF9F2] px-3 py-2.5 text-xs font-medium text-[#0F7B45]">
                <ShieldCheck className="mt-px size-4 shrink-0" aria-hidden />
                {t("privacy")}
              </p>
            </fieldset>
          </div>

          {notice ? (
            <p className="border-t border-slate-100 bg-[#EEF4FF] px-6 py-2.5 text-center text-xs font-semibold text-[#1E4FB8]">{notice}</p>
          ) : null}
          <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-[#FAFBFE] px-6 py-4">
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="text-sm font-semibold text-[#5a6072] transition-colors hover:text-[#16233F]"
            >
              {t("launcher.reset")}
            </button>
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E6DEB] to-[#2F7BF5] px-6 text-[15px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(30,109,235,0.95)] transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:translate-y-0 rtl:bg-gradient-to-l"
            >
              <MapPinned className="size-4" aria-hidden />
              {t("launcher.submit")}
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="me-2 inline-flex size-5 items-center justify-center rounded-full bg-[#1E6DEB]/10 text-[11px] font-extrabold text-[#1E6DEB]">
      {n}
    </span>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1E6DEB]",
        selected
          ? "border-[#1E6DEB] bg-[#1E6DEB] text-white shadow-[0_6px_14px_-8px_rgba(30,109,235,0.9)]"
          : "border-slate-200 bg-white text-[#1F2A44] hover:border-[#1E6DEB]/50 hover:bg-[#EEF4FF]",
      )}
    >
      {selected ? <Check className="-ms-0.5 me-1 size-3.5" aria-hidden /> : null}
      {children}
    </button>
  );
}

function StartOption({
  selected,
  onClick,
  icon,
  title,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-2xl border-2 p-3.5 text-start transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
        selected ? "border-[#1E6DEB] bg-[#F3F7FF]" : "border-slate-200 hover:border-[#1E6DEB]/40",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-[#1E6DEB] text-white" : "bg-slate-100 text-[#5a6072]",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-[#16233F]">{title}</span>
        <span className="mt-0.5 block text-xs text-[#5a6072]">{hint}</span>
      </span>
    </button>
  );
}
