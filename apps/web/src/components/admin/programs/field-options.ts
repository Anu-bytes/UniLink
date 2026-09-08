import type { SelectOption } from "@/components/admin";
import { FIELDS_OF_STUDY } from "@/lib/fields";

/**
 * Fields of study carry their own en/ar labels in lib/fields, so they are not
 * translation keys — the list is data the catalogue and the matcher already
 * share.
 */
export function fieldOfStudyOptions(locale: string): SelectOption[] {
  return FIELDS_OF_STUDY.map((field) => ({
    value: field.value,
    label: locale === "ar" ? field.ar : field.en,
  }));
}

/**
 * Falls back to the stored value: `fieldOfStudy` is a free string column, so
 * an import or an older row may hold something the list has since dropped, and
 * a blank table cell would hide it.
 */
export function fieldOfStudyLabel(locale: string, value: string): string {
  const match = FIELDS_OF_STUDY.find((field) => field.value === value);
  if (!match) return value;
  return locale === "ar" ? match.ar : match.en;
}
