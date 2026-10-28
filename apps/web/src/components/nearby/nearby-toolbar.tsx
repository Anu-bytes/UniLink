"use client";

import { Popover } from "@base-ui/react/popover";
import { Check, ChevronDown, Crosshair, LocateFixed, Lock, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DistanceControl, FieldList } from "@/components/nearby/nearby-controls";
import type { NearbyField } from "@/lib/nearby";
import type { NearbyFilters, NearbyLevel } from "@/lib/nearby-filters";
import { cn } from "@/lib/utils";

export type OriginSource = "gps" | "pin" | null;

/**
 * The row of filter pills above the map. Every change applies at once (the
 * list and map update live); for a guest's free search the filters are fixed
 * and a pill opens the sign-up prompt instead.
 */
export function NearbyToolbar({
  fields,
  filters,
  onChange,
  originSource,
  locating,
  picking,
  onLocate,
  onPick,
  locked,
  onLocked,
  floating = false,
}: {
  fields: NearbyField[];
  levels?: NearbyLevel[];
  filters: NearbyFilters;
  onChange: (next: NearbyFilters) => void;
  originSource: OriginSource;
  locating: boolean;
  picking: boolean;
  onLocate: () => void;
  onPick: () => void;
  locked: boolean;
  onLocked: () => void;
  /** Over the map on phones: pills get their own white background. */
  floating?: boolean;
}) {
  const t = useTranslations("Nearby");
  const fieldLabel = fields.find((field) => field.value === filters.field)?.label;
  const hasFilters = Boolean(filters.field || filters.level || filters.type || filters.radius);

  const originLabel = locating
    ? t("toolbar.locating")
    : picking
      ? t("toolbar.picking")
      : originSource === "gps"
        ? t("toolbar.fromGps")
        : originSource === "pin"
          ? t("toolbar.fromPin")
          : t("toolbar.noOrigin");
  const OriginIcon = originSource === "pin" ? MapPin : originSource === "gps" ? LocateFixed : Crosshair;

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        floating ? "ul-no-scrollbar overflow-x-auto px-3 py-3" : "flex-wrap",
      )}
    >
      <ToolbarPopover
        floating={floating}
        active={Boolean(originSource)}
        icon={
          locating ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-[#1E6DEB]/30 border-t-[#1E6DEB]" aria-hidden />
          ) : (
            <OriginIcon className="size-4" aria-hidden />
          )
        }
        label={originLabel}
        width={300}
      >
        {(close) => (
          <div className="p-1.5">
            <MenuItem
              icon={<LocateFixed className="size-4" aria-hidden />}
              title={t("toolbar.useGps")}
              hint={t("toolbar.useGpsHint")}
              selected={originSource === "gps"}
              onClick={() => {
                close();
                onLocate();
              }}
            />
            <MenuItem
              icon={<MapPin className="size-4" aria-hidden />}
              title={t("toolbar.usePin")}
              hint={t("toolbar.usePinHint")}
              selected={originSource === "pin"}
              onClick={() => {
                close();
                onPick();
              }}
            />
            <p className="mx-2 mb-1 mt-2 flex items-start gap-1.5 border-t border-slate-100 pt-2.5 text-xs leading-5 text-slate-500">
              <Lock className="mt-0.5 size-3 shrink-0" aria-hidden />
              {t("privacy")}
            </p>
          </div>
        )}
      </ToolbarPopover>

      {!floating ? <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden /> : null}

      <ToolbarPopover
        floating={floating}
        active={Boolean(filters.field)}
        label={fieldLabel ?? t("controls.field")}
        locked={locked}
        onLocked={onLocked}
        width={340}
      >
        {(close) => (
          <div className="p-3">
            <FieldList
              fields={fields}
              value={filters.field}
              autoFocus
              onChange={(value) => {
                onChange({ ...filters, field: value });
                close();
              }}
              className="h-[320px]"
            />
          </div>
        )}
      </ToolbarPopover>

      <ToolbarPopover
        floating={floating}
        active={Boolean(filters.type)}
        label={filters.type ? t(`types.${filters.type}`) : t("controls.type")}
        locked={locked}
        onLocked={onLocked}
        width={220}
      >
        {(close) => (
          <OptionList
            value={filters.type ?? "ANY"}
            options={[
              { value: "ANY", label: t("controls.anyType") },
              { value: "PRIVATE", label: t("types.PRIVATE") },
              { value: "NATIONAL", label: t("types.NATIONAL") },
            ]}
            onChange={(value) => {
              onChange({ ...filters, type: value === "ANY" ? null : (value as "PRIVATE" | "NATIONAL") });
              close();
            }}
          />
        )}
      </ToolbarPopover>

      <ToolbarPopover
        floating={floating}
        active={Boolean(filters.radius)}
        label={filters.radius ? t("toolbar.within", { km: filters.radius }) : t("controls.anyDistance")}
        locked={locked}
        onLocked={onLocked}
        width={300}
      >
        {() => (
          <div className="p-4">
            <p className="mb-3 text-[13px] font-medium text-slate-700">{t("controls.distance")}</p>
            <DistanceControl value={filters.radius} onChange={(radius) => onChange({ ...filters, radius })} />
          </div>
        )}
      </ToolbarPopover>

      {hasFilters && !locked ? (
        <button
          type="button"
          onClick={() => onChange({ ...filters, field: null, level: null, type: null, radius: null })}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-900",
            floating && "bg-white shadow-[0_2px_8px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)]",
          )}
        >
          <X className="size-3.5" aria-hidden />
          {t("toolbar.clear")}
        </button>
      ) : null}
    </div>
  );
}

function pillClass(active: boolean, floating: boolean) {
  return cn(
    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium whitespace-nowrap transition-[border-color,background-color,color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] data-popup-open:border-slate-900",
    active
      ? "border-[#1E6DEB]/30 bg-[#EFF5FF] text-[#1E6DEB] hover:border-[#1E6DEB]/60"
      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    floating && "border-transparent shadow-[0_2px_8px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)]",
  );
}

function ToolbarPopover({
  label,
  icon,
  active,
  locked = false,
  onLocked,
  width,
  floating,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  locked?: boolean;
  onLocked?: () => void;
  width: number;
  floating: boolean;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (locked) {
    return (
      <button type="button" onClick={onLocked} className={pillClass(active, floating)}>
        {icon}
        <span className="max-w-[180px] truncate">{label}</span>
        <Lock className="size-3 opacity-50" aria-hidden />
      </button>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className={pillClass(active, floating)}>
        {icon}
        <span className="max-w-[180px] truncate">{label}</span>
        <ChevronDown className="size-3.5 opacity-60 transition-transform in-data-popup-open:rotate-180" aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="start" collisionPadding={12} className="z-[1200]">
          <Popover.Popup
            className="ul-pop max-h-[min(480px,var(--available-height))] overflow-hidden rounded-xl bg-white text-slate-900 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.25),0_0_0_1px_rgba(15,23,42,0.06)] outline-none"
            style={{ width: `min(${width}px, calc(100vw - 24px))` }}
          >
            {children(() => setOpen(false))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function OptionList<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <ul role="listbox" className="p-1.5">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <li key={option.value} role="option" aria-selected={selected}>
            <button
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors",
                selected ? "bg-[#EFF5FF] font-medium text-[#1E6DEB]" : "text-slate-700 hover:bg-slate-50",
              )}
            >
              {option.label}
              {selected ? <Check className="size-4" aria-hidden /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MenuItem({
  icon,
  title,
  hint,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-start transition-colors hover:bg-slate-50"
    >
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-[#1E6DEB] text-white" : "bg-slate-100 text-slate-600",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-900">{title}</span>
        <span className="block text-xs text-slate-500">{hint}</span>
      </span>
      {selected ? <Check className="mt-1.5 size-4 shrink-0 text-[#1E6DEB]" aria-hidden /> : null}
    </button>
  );
}
