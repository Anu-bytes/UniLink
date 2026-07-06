import type { Locale } from "../config";
import en, { type Messages } from "./en";
import ar from "./ar";

const dictionaries: Record<Locale, Messages> = { en, ar };

/** Pure function — safe to call from server or client components. */
export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? en;
}

export type { Messages };
