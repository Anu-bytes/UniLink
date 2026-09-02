import { getLocale, getTranslations } from "next-intl/server";

import { formatDate, formatNumber } from "@/lib/format";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Both instants are floored to UTC midnight so "yesterday" flips on the date
 * boundary rather than 24 hours after the row was written, and so the word
 * agrees with the absolute date in the tooltip — formatDate pins UTC too.
 */
function utcMidnight(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** Recent-activity timestamps: a word for this week, a real date after that. */
export async function RelativeDate({ value }: { value: Date }) {
  const t = await getTranslations("Admin.overview.relative");
  const locale = await getLocale();

  const absolute = formatDate(locale, value);
  const days = Math.round((utcMidnight(new Date()) - utcMidnight(value)) / DAY_MS);

  const label =
    days <= 0
      ? t("today")
      : days === 1
        ? t("yesterday")
        : days < 7
          ? t("daysAgo", { days: formatNumber(locale, days) })
          : absolute;

  return (
    <time
      dateTime={value.toISOString()}
      title={absolute}
      className="whitespace-nowrap text-[12.5px] text-[#94A3B8]"
    >
      {label}
    </time>
  );
}
