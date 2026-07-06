import type { Bilingual } from "./types";
import type { Locale } from "@/i18n/config";

export function pick(b: Bilingual, locale: Locale): string {
  return locale === "ar" ? b.ar || b.en : b.en || b.ar;
}

const CURRENCY: Record<Locale, string> = { en: "EGP", ar: "ج.م" };

export function formatEGP(value: number, locale: Locale): string {
  const nf = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 0,
  });
  return locale === "ar"
    ? `${nf.format(value)} ${CURRENCY.ar}`
    : `${CURRENCY.en} ${nf.format(value)}`;
}

export function formatFeeRange(min: number, max: number, locale: Locale): string {
  const nf = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 0,
  });
  const range = `${nf.format(min)}–${nf.format(max)}`;
  return locale === "ar"
    ? `${range} ${CURRENCY.ar}`
    : `${CURRENCY.en} ${range}`;
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(value);
}

export function formatDistance(km: number, locale: Locale): string {
  const rounded = km < 10 ? Math.round(km * 10) / 10 : Math.round(km);
  return `${formatNumber(rounded, locale)} ${locale === "ar" ? "كم" : "km"}`;
}
