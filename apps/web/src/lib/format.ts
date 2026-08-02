// Display helpers shared by the catalogue, search and compare surfaces.
// Anything that needs wording (level names, tag names) is translated in the
// components instead; this file only handles numbers and dates.

// Node and browsers resolve the default numbering system for `ar` differently
// (Node's ICU picks arab, Chrome picks latn), so an unpinned Intl call renders
// ٩٨٬٠٠٠ on the server and 98,000 on the client. That is a hydration mismatch
// in any client component, so pin the digits for every locale. Latin digits
// also keep the compare CSV export parseable by spreadsheets.
const NUMBERING_SYSTEM = "latn";

/** Currency amount with no decimals, e.g. "EGP 98,000" / "98,000 ج.م.". */
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
    numberingSystem: NUMBERING_SYSTEM,
  }).format(amount);
}

export function formatNumber(locale: string, value: number) {
  return new Intl.NumberFormat(locale, {
    numberingSystem: NUMBERING_SYSTEM,
  }).format(value);
}

/** Abbreviates large counts the way the hero meta row does: 13.9K, 1.2M. */
export function formatCompact(locale: string, value: number) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
    numberingSystem: NUMBERING_SYSTEM,
  }).format(value);
}

export function formatDate(locale: string, value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: NUMBERING_SYSTEM,
    // Pin the zone too: the server runs in UTC while the browser uses the
    // visitor's zone, which can render a date one day out.
    timeZone: "UTC",
  }).format(date);
}

export function formatMonthYear(locale: string, value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    numberingSystem: NUMBERING_SYSTEM,
    timeZone: "UTC",
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
