"use client";

import { useLocale, useTranslations } from "next-intl";

import { formatDate, formatNumber } from "@/lib/format";

const DAY_MS = 24 * 60 * 60 * 1000;
const utcMidnight = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

/** Client twin of overview/relative-date: a word for this week, a date after. */
export function When({ value }: { value: string }) {
  const t = useTranslations("Admin.overview.relative");
  const locale = useLocale();
  const date = new Date(value);
  const absolute = formatDate(locale, date);
  const days = Math.round((utcMidnight(new Date()) - utcMidnight(date)) / DAY_MS);
  const label =
    days <= 0
      ? t("today")
      : days === 1
        ? t("yesterday")
        : days < 7
          ? t("daysAgo", { days: formatNumber(locale, days) })
          : absolute;
  return (
    <time dateTime={value} title={absolute}>
      {label}
    </time>
  );
}
