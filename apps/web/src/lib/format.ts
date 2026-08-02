// Display helpers shared by the catalogue, search and compare surfaces.
// Anything that needs wording (level names, tag names) is translated in the
// components instead; this file only handles numbers and dates.

/** Currency amount with no decimals, e.g. "EGP 98,000" / "٩٨٬٠٠٠ ج.م.". */
export function formatMoney(
  locale: string,
  amount: number | null | undefined,
  currency: string,
) {
  if (amount == null) return null;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(locale: string, value: number) {
  return new Intl.NumberFormat(locale).format(value);
}

/** Abbreviates large counts the way the hero meta row does: 13.9K, 1.2M. */
export function formatCompact(locale: string, value: number) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(locale: string, value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatMonthYear(locale: string, value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
  }).format(date);
}

/** Whole years when the month count divides evenly, otherwise null. */
export function yearsFromMonths(months: number | null | undefined) {
  if (!months || months % 12 !== 0) return null;
  return months / 12;
}

/** Deterministic pastel background for a logo placeholder, keyed by name. */
export function initialsAvatar(name: string) {
  const initials = name
    .replace(/^(the|al|el)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();

  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }

  return {
    initials: initials || "U",
    background: `hsl(${hash} 62% 92%)`,
    color: `hsl(${hash} 58% 34%)`,
  };
}
