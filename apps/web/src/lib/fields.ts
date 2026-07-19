// Common fields of study offered across Egyptian universities.
// `value` is the stable identifier we persist; en/ar are display labels.

export type FieldOption = { value: string; en: string; ar: string };

export const FIELDS_OF_STUDY: readonly FieldOption[] = [
  { value: "medicine", en: "Medicine", ar: "الطب البشري" },
  { value: "dentistry", en: "Dentistry", ar: "طب الأسنان" },
  { value: "pharmacy", en: "Pharmacy", ar: "الصيدلة" },
  { value: "nursing", en: "Nursing", ar: "التمريض" },
  { value: "physical_therapy", en: "Physical Therapy", ar: "العلاج الطبيعي" },
  { value: "veterinary", en: "Veterinary Medicine", ar: "الطب البيطري" },
  { value: "engineering", en: "Engineering", ar: "الهندسة" },
  { value: "computer_science", en: "Computer Science", ar: "علوم الحاسب" },
  {
    value: "information_technology",
    en: "Information Technology",
    ar: "تكنولوجيا المعلومات",
  },
  {
    value: "artificial_intelligence",
    en: "Artificial Intelligence",
    ar: "الذكاء الاصطناعي",
  },
  { value: "data_science", en: "Data Science", ar: "علم البيانات" },
  { value: "architecture", en: "Architecture", ar: "الهندسة المعمارية" },
  {
    value: "business_administration",
    en: "Business Administration",
    ar: "إدارة الأعمال",
  },
  { value: "accounting", en: "Accounting", ar: "المحاسبة" },
  { value: "commerce", en: "Commerce", ar: "التجارة" },
  {
    value: "economics_political_science",
    en: "Economics & Political Science",
    ar: "الاقتصاد والعلوم السياسية",
  },
  { value: "law", en: "Law", ar: "الحقوق" },
  {
    value: "mass_communication",
    en: "Mass Communication",
    ar: "الإعلام",
  },
  {
    value: "languages_translation",
    en: "Languages & Translation",
    ar: "الألسن والترجمة",
  },
  { value: "arts_humanities", en: "Arts & Humanities", ar: "الآداب" },
  { value: "education", en: "Education", ar: "التربية" },
  { value: "science", en: "Science", ar: "العلوم" },
  { value: "agriculture", en: "Agriculture", ar: "الزراعة" },
  { value: "tourism_hotels", en: "Tourism & Hotels", ar: "السياحة والفنادق" },
  { value: "fine_arts", en: "Fine Arts", ar: "الفنون الجميلة" },
  { value: "applied_arts", en: "Applied Arts", ar: "الفنون التطبيقية" },
  { value: "social_work", en: "Social Work", ar: "الخدمة الاجتماعية" },
  {
    value: "physical_education",
    en: "Physical Education",
    ar: "التربية الرياضية",
  },
] as const;
