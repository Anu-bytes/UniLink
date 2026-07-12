import type { Bilingual } from "@/lib/types";

// Controlled vocabularies for student registration (from the Features doc).
// These live alongside the Phase 1 fields/fee-buckets and feed the onboarding wizard.

export type HighSchoolTypeId = "thanaweya" | "ig" | "american" | "other";
export type CertificationId = "bsc" | "diploma" | "msc" | "phd";

export const HIGH_SCHOOL_TYPES: { id: HighSchoolTypeId; label: Bilingual }[] = [
  { id: "thanaweya", label: { en: "Thanaweya Amma", ar: "الثانوية العامة" } },
  { id: "ig", label: { en: "IGCSE / British (IG)", ar: "الشهادة البريطانية (IG)" } },
  { id: "american", label: { en: "American Diploma", ar: "الدبلومة الأمريكية" } },
  { id: "other", label: { en: "Other", ar: "أخرى" } },
];

export const CERTIFICATIONS: { id: CertificationId; label: Bilingual }[] = [
  { id: "bsc", label: { en: "B.Sc. (Bachelor)", ar: "بكالوريوس" } },
  { id: "diploma", label: { en: "Diploma", ar: "دبلوم" } },
  { id: "msc", label: { en: "M.Sc. (Master)", ar: "ماجستير" } },
  { id: "phd", label: { en: "Ph.D. (Doctorate)", ar: "دكتوراه" } },
];

export const HIGH_SCHOOL_IDS: HighSchoolTypeId[] = HIGH_SCHOOL_TYPES.map((h) => h.id);
export const CERTIFICATION_IDS: CertificationId[] = CERTIFICATIONS.map((c) => c.id);
