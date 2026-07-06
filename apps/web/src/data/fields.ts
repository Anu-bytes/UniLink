import type { FieldOfStudy, FieldOfStudyId } from "@/lib/types";

export const FIELDS: FieldOfStudy[] = [
  { id: "business", name: { en: "Business & Management", ar: "إدارة الأعمال" } },
  { id: "engineering", name: { en: "Engineering", ar: "الهندسة" } },
  { id: "cs-ai-it", name: { en: "Computer Science, AI & IT", ar: "الحاسبات والذكاء الاصطناعي" } },
  { id: "medicine", name: { en: "Medicine & Healthcare", ar: "الطب والرعاية الصحية" } },
  { id: "pharmacy", name: { en: "Pharmacy", ar: "الصيدلة" } },
  { id: "dentistry", name: { en: "Dentistry", ar: "طب الأسنان" } },
  { id: "media", name: { en: "Media & Communication", ar: "الإعلام والاتصال" } },
  { id: "arts-design", name: { en: "Arts & Design", ar: "الفنون والتصميم" } },
  { id: "law", name: { en: "Law", ar: "القانون" } },
  { id: "economics-poli", name: { en: "Economics & Political Science", ar: "الاقتصاد والعلوم السياسية" } },
  { id: "education", name: { en: "Education", ar: "التربية" } },
  { id: "languages", name: { en: "Languages & Translation", ar: "اللغات والترجمة" } },
  { id: "tourism", name: { en: "Tourism & Hospitality", ar: "السياحة والضيافة" } },
  { id: "applied-sciences", name: { en: "Applied Sciences", ar: "العلوم التطبيقية" } },
  { id: "social-sciences", name: { en: "Social Sciences & Humanities", ar: "العلوم الاجتماعية والإنسانية" } },
];

const byId = new Map(FIELDS.map((f) => [f.id, f]));

export function getField(id: FieldOfStudyId): FieldOfStudy {
  return byId.get(id) ?? FIELDS[0];
}
