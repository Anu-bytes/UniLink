import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared shell for the profile page's sections. Plain (no hooks, no server-only
 * imports) so both the server page and the client preferences editor can use it
 * and stay visually identical.
 */
export function ProfileCard({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  /** Rendered at the end of the header row, e.g. an Edit button. */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#1E6DEB]"
          >
            <Icon className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#1F2A44]">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs text-[#5a6072]">{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </header>

      <div className="px-5 py-5 md:px-6">{children}</div>
    </section>
  );
}

/**
 * One label/value pair. Unset values render as muted placeholder text rather
 * than a bare dash, so a gap reads as "not filled in" instead of broken.
 */
export function ProfileField({
  label,
  value,
  emptyLabel,
  ltr,
  className,
}: {
  label: string;
  value: string | null | undefined;
  emptyLabel: string;
  /** Forces LTR for emails and phone numbers inside an RTL page. */
  ltr?: boolean;
  className?: string;
}) {
  const filled = Boolean(value && value.trim());

  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
        {label}
      </dt>
      <dd
        dir={ltr ? "ltr" : undefined}
        className={cn(
          "mt-1 break-words text-[15px]",
          filled ? "font-semibold text-[#1F2A44]" : "italic text-[#98A0B4]",
        )}
      >
        {filled ? value : emptyLabel}
      </dd>
    </div>
  );
}

/**
 * Profile completeness. The match scoring in lib/matching.ts reads these
 * fields, so showing what is missing explains why results may be vague.
 */
export function CompletenessBar({
  complete,
  total,
  label,
  hint,
}: {
  complete: number;
  total: number;
  label: string;
  hint?: string;
}) {
  const percent = total === 0 ? 0 : Math.round((complete / total) * 100);
  const done = percent === 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#5a6072]">{label}</p>
        <p
          className={cn(
            "text-xs font-bold",
            done ? "text-[#1F7A4D]" : "text-[#1E6DEB]",
          )}
        >
          {percent}%
        </p>
      </div>
      <div
        role="meter"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            done ? "bg-[#2FA36B]" : "bg-[#1E6DEB]",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {hint && !done ? (
        <p className="mt-1.5 text-xs text-[#98A0B4]">{hint}</p>
      ) : null}
    </div>
  );
}
