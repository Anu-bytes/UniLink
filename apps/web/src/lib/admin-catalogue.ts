import type { Prisma } from "@prisma/client";

export type ContentCheck = { key: "nameAr" | "description" | "descriptionAr" | "image" | "logo" | "cover"; present: boolean };

type ContentFields = { nameAr: string | null; description: string | null; descriptionAr: string | null };
const filled = (value: string | null) => Boolean(value?.trim());

/** A content checklist, not a publication gate or a claim of overall readiness. */
export function catalogueChecks(record: ContentFields & { imageUrl: string | null }): ContentCheck[];
export function catalogueChecks(record: ContentFields & { logoUrl: string | null; coverImageUrl: string | null }): ContentCheck[];
export function catalogueChecks(record: ContentFields & { imageUrl?: string | null; logoUrl?: string | null; coverImageUrl?: string | null }): ContentCheck[] {
  return [
    { key: "nameAr", present: filled(record.nameAr) },
    { key: "description", present: filled(record.description) },
    { key: "descriptionAr", present: filled(record.descriptionAr) },
    ...("imageUrl" in record
      ? [{ key: "image" as const, present: filled(record.imageUrl ?? null) }]
      : [{ key: "logo" as const, present: filled(record.logoUrl ?? null) }, { key: "cover" as const, present: filled(record.coverImageUrl ?? null) }]),
  ];
}

export function admissionCoverage(facultyRules: number, universityRules: number) {
  return facultyRules > 0 ? "facultyRules" : universityRules > 0 ? "universityRules" : "noRules";
}

// The database side of catalogueChecks for universities: a profile missing any
// of the checked texts or images. Empty strings count as missing, as above.
export const UNIVERSITY_MISSING_CONTENT = {
  OR: (["nameAr", "description", "descriptionAr", "logoUrl", "coverImageUrl"] as const).flatMap((key) => [{ [key]: null }, { [key]: "" }]),
} satisfies Prisma.UniversityWhereInput;
