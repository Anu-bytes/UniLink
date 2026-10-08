import { Target } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import {
  ADMISSION_LIMITS_YEAR,
  CERTIFICATE_GROUPS,
  type AdmissionLimit,
  type CertificateGroup,
} from "@/lib/admission-limits";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * A program's published minimum for both certificate groups, side by side,
 * so a Thanaweya Amma student and an IGCSE student each find their number
 * without reading a footnote. The viewer's own group is highlighted when we
 * know their certificate.
 */
export async function AdmissionLimitPanel({
  limit,
  highlight = null,
  className,
}: {
  limit: Pick<AdmissionLimit, "EGYPTIAN" | "EQUIVALENT" | "branch">;
  highlight?: CertificateGroup | null;
  className?: string;
}) {
  const t = await getTranslations("Admission");
  const locale = await getLocale();

  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-gradient-to-br from-[#F7FAFF] to-white p-4 sm:p-5",
        className,
      )}
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#1F2A44] sm:text-base">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[#1E6DEB] text-white">
            <Target className="size-4" aria-hidden />
          </span>
          {t("minimumToApply")}
        </h3>
        <span className="rounded-full bg-[#EEF3FF] px-2.5 py-0.5 text-xs font-semibold text-[#1E3A8A]">
          {t("year", { year: ADMISSION_LIMITS_YEAR })}
        </span>
        {limit.branch ? (
          <span className="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 text-xs font-semibold text-[#B77714]">
            {t(`branches.${limit.branch}`)}
          </span>
        ) : null}
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {CERTIFICATE_GROUPS.map((group) => (
          <LimitBox
            key={group}
            label={t(`groups.${group}`)}
            value={limit[group]}
            locale={locale}
            mine={highlight === group}
            mineLabel={t("yourCertificate")}
            notOffered={t("notOffered")}
          />
        ))}
      </div>
    </section>
  );
}

function LimitBox({
  label,
  value,
  locale,
  mine,
  mineLabel,
  notOffered,
}: {
  label: string;
  value: number | null;
  locale: string;
  mine: boolean;
  mineLabel: string;
  notOffered: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-white p-3.5",
        mine ? "border-[#1E6DEB] ring-2 ring-[#1E6DEB]/15" : "border-slate-200",
      )}
    >
      {mine ? (
        <span className="absolute -top-2.5 end-3 rounded-full bg-[#1E6DEB] px-2 py-0.5 text-[10px] font-bold text-white">
          {mineLabel}
        </span>
      ) : null}
      <p className="text-xs font-semibold leading-snug text-[#5a6072]">{label}</p>
      {value != null ? (
        <>
          <p className="mt-1.5 text-2xl font-extrabold leading-none text-[#1F2A44]" dir="ltr">
            {formatNumber(locale, value)}%
          </p>
          <div
            aria-hidden
            className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#E8EEF8]"
          >
            <div
              className={cn("h-full rounded-full", mine ? "bg-[#1E6DEB]" : "bg-[#7FA8EE]")}
              style={{ width: `${value}%` }}
            />
          </div>
        </>
      ) : (
        <p className="mt-1.5 text-base font-semibold text-[#98A0B4]">{notOffered}</p>
      )}
    </div>
  );
}

/**
 * Compact version for program cards: both certificate groups as two short
 * lines under one label.
 */
export async function AdmissionLimitBadge({
  limit,
}: {
  limit: Pick<AdmissionLimit, "EGYPTIAN" | "EQUIVALENT">;
}) {
  const t = await getTranslations("Admission");
  const locale = await getLocale();

  return (
    <div className="shrink-0 rounded-xl bg-[#F7F9FE] px-3 py-2">
      <p className="flex items-center gap-1 text-[11px] font-semibold text-[#98A0B4]">
        <Target className="size-3" aria-hidden />
        {t("minimumToApply")}
      </p>
      <dl className="mt-1 grid grid-cols-[auto_auto] items-baseline justify-end gap-x-2.5 gap-y-0.5">
        {CERTIFICATE_GROUPS.map((group) => {
          const value = limit[group];
          return (
            <div key={group} className="contents">
              <dt
                className={cn(
                  "text-[10px] font-bold",
                  group === "EGYPTIAN" ? "text-[#1E6DEB]" : "text-[#0F8A7C]",
                )}
                title={t(`groups.${group}`)}
              >
                {t(`groupsShort.${group}`)}
              </dt>
              <dd className="text-end text-sm font-bold text-[#1F2A44]" dir="ltr">
                {value != null ? `${formatNumber(locale, value)}%` : "—"}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
