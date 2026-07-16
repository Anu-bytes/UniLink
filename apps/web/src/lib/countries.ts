// Nationalities / countries. Codes are ISO 3166-1 alpha-2.
// `name` is the English label, `nameAr` the Arabic label (the app is bilingual).
// Covers all common nationalities and every Arab League state.

export type Country = { code: string; name: string; nameAr: string };

export const COUNTRIES: readonly Country[] = [
  { code: "AF", name: "Afghanistan", nameAr: "أفغانستان" },
  { code: "AL", name: "Albania", nameAr: "ألبانيا" },
  { code: "DZ", name: "Algeria", nameAr: "الجزائر" },
  { code: "AO", name: "Angola", nameAr: "أنغولا" },
  { code: "AR", name: "Argentina", nameAr: "الأرجنتين" },
  { code: "AM", name: "Armenia", nameAr: "أرمينيا" },
  { code: "AU", name: "Australia", nameAr: "أستراليا" },
  { code: "AT", name: "Austria", nameAr: "النمسا" },
  { code: "AZ", name: "Azerbaijan", nameAr: "أذربيجان" },
  { code: "BH", name: "Bahrain", nameAr: "البحرين" },
  { code: "BD", name: "Bangladesh", nameAr: "بنغلاديش" },
  { code: "BY", name: "Belarus", nameAr: "بيلاروسيا" },
  { code: "BE", name: "Belgium", nameAr: "بلجيكا" },
  { code: "BJ", name: "Benin", nameAr: "بنين" },
  { code: "BO", name: "Bolivia", nameAr: "بوليفيا" },
  { code: "BA", name: "Bosnia and Herzegovina", nameAr: "البوسنة والهرسك" },
  { code: "BR", name: "Brazil", nameAr: "البرازيل" },
  { code: "BG", name: "Bulgaria", nameAr: "بلغاريا" },
  { code: "BF", name: "Burkina Faso", nameAr: "بوركينا فاسو" },
  { code: "BI", name: "Burundi", nameAr: "بوروندي" },
  { code: "KH", name: "Cambodia", nameAr: "كمبوديا" },
  { code: "CM", name: "Cameroon", nameAr: "الكاميرون" },
  { code: "CA", name: "Canada", nameAr: "كندا" },
  { code: "TD", name: "Chad", nameAr: "تشاد" },
  { code: "CL", name: "Chile", nameAr: "تشيلي" },
  { code: "CN", name: "China", nameAr: "الصين" },
  { code: "CO", name: "Colombia", nameAr: "كولومبيا" },
  { code: "KM", name: "Comoros", nameAr: "جزر القمر" },
  { code: "CG", name: "Congo", nameAr: "الكونغو" },
  { code: "CD", name: "Congo (DRC)", nameAr: "الكونغو الديمقراطية" },
  { code: "CR", name: "Costa Rica", nameAr: "كوستاريكا" },
  { code: "CI", name: "Côte d'Ivoire", nameAr: "ساحل العاج" },
  { code: "HR", name: "Croatia", nameAr: "كرواتيا" },
  { code: "CU", name: "Cuba", nameAr: "كوبا" },
  { code: "CY", name: "Cyprus", nameAr: "قبرص" },
  { code: "CZ", name: "Czechia", nameAr: "التشيك" },
  { code: "DK", name: "Denmark", nameAr: "الدنمارك" },
  { code: "DJ", name: "Djibouti", nameAr: "جيبوتي" },
  { code: "DO", name: "Dominican Republic", nameAr: "جمهورية الدومينيكان" },
  { code: "EC", name: "Ecuador", nameAr: "الإكوادور" },
  { code: "EG", name: "Egypt", nameAr: "مصر" },
  { code: "SV", name: "El Salvador", nameAr: "السلفادور" },
  { code: "ER", name: "Eritrea", nameAr: "إريتريا" },
  { code: "EE", name: "Estonia", nameAr: "إستونيا" },
  { code: "ET", name: "Ethiopia", nameAr: "إثيوبيا" },
  { code: "FI", name: "Finland", nameAr: "فنلندا" },
  { code: "FR", name: "France", nameAr: "فرنسا" },
  { code: "GA", name: "Gabon", nameAr: "الغابون" },
  { code: "GM", name: "Gambia", nameAr: "غامبيا" },
  { code: "GE", name: "Georgia", nameAr: "جورجيا" },
  { code: "DE", name: "Germany", nameAr: "ألمانيا" },
  { code: "GH", name: "Ghana", nameAr: "غانا" },
  { code: "GR", name: "Greece", nameAr: "اليونان" },
  { code: "GT", name: "Guatemala", nameAr: "غواتيمالا" },
  { code: "GN", name: "Guinea", nameAr: "غينيا" },
  { code: "HN", name: "Honduras", nameAr: "هندوراس" },
  { code: "HK", name: "Hong Kong", nameAr: "هونغ كونغ" },
  { code: "HU", name: "Hungary", nameAr: "المجر" },
  { code: "IS", name: "Iceland", nameAr: "آيسلندا" },
  { code: "IN", name: "India", nameAr: "الهند" },
  { code: "ID", name: "Indonesia", nameAr: "إندونيسيا" },
  { code: "IR", name: "Iran", nameAr: "إيران" },
  { code: "IQ", name: "Iraq", nameAr: "العراق" },
  { code: "IE", name: "Ireland", nameAr: "أيرلندا" },
  { code: "IT", name: "Italy", nameAr: "إيطاليا" },
  { code: "JM", name: "Jamaica", nameAr: "جامايكا" },
  { code: "JP", name: "Japan", nameAr: "اليابان" },
  { code: "JO", name: "Jordan", nameAr: "الأردن" },
  { code: "KZ", name: "Kazakhstan", nameAr: "كازاخستان" },
  { code: "KE", name: "Kenya", nameAr: "كينيا" },
  { code: "KW", name: "Kuwait", nameAr: "الكويت" },
  { code: "KG", name: "Kyrgyzstan", nameAr: "قيرغيزستان" },
  { code: "LA", name: "Laos", nameAr: "لاوس" },
  { code: "LV", name: "Latvia", nameAr: "لاتفيا" },
  { code: "LB", name: "Lebanon", nameAr: "لبنان" },
  { code: "LY", name: "Libya", nameAr: "ليبيا" },
  { code: "LT", name: "Lithuania", nameAr: "ليتوانيا" },
  { code: "LU", name: "Luxembourg", nameAr: "لوكسمبورغ" },
  { code: "MG", name: "Madagascar", nameAr: "مدغشقر" },
  { code: "MW", name: "Malawi", nameAr: "مالاوي" },
  { code: "MY", name: "Malaysia", nameAr: "ماليزيا" },
  { code: "ML", name: "Mali", nameAr: "مالي" },
  { code: "MT", name: "Malta", nameAr: "مالطا" },
  { code: "MR", name: "Mauritania", nameAr: "موريتانيا" },
  { code: "MU", name: "Mauritius", nameAr: "موريشيوس" },
  { code: "MX", name: "Mexico", nameAr: "المكسيك" },
  { code: "MD", name: "Moldova", nameAr: "مولدوفا" },
  { code: "MN", name: "Mongolia", nameAr: "منغوليا" },
  { code: "ME", name: "Montenegro", nameAr: "الجبل الأسود" },
  { code: "MA", name: "Morocco", nameAr: "المغرب" },
  { code: "MZ", name: "Mozambique", nameAr: "موزمبيق" },
  { code: "MM", name: "Myanmar", nameAr: "ميانمار" },
  { code: "NP", name: "Nepal", nameAr: "نيبال" },
  { code: "NL", name: "Netherlands", nameAr: "هولندا" },
  { code: "NZ", name: "New Zealand", nameAr: "نيوزيلندا" },
  { code: "NI", name: "Nicaragua", nameAr: "نيكاراغوا" },
  { code: "NE", name: "Niger", nameAr: "النيجر" },
  { code: "NG", name: "Nigeria", nameAr: "نيجيريا" },
  { code: "KP", name: "North Korea", nameAr: "كوريا الشمالية" },
  { code: "MK", name: "North Macedonia", nameAr: "مقدونيا الشمالية" },
  { code: "NO", name: "Norway", nameAr: "النرويج" },
  { code: "OM", name: "Oman", nameAr: "عُمان" },
  { code: "PK", name: "Pakistan", nameAr: "باكستان" },
  { code: "PS", name: "Palestine", nameAr: "فلسطين" },
  { code: "PA", name: "Panama", nameAr: "بنما" },
  { code: "PG", name: "Papua New Guinea", nameAr: "بابوا غينيا الجديدة" },
  { code: "PY", name: "Paraguay", nameAr: "باراغواي" },
  { code: "PE", name: "Peru", nameAr: "بيرو" },
  { code: "PH", name: "Philippines", nameAr: "الفلبين" },
  { code: "PL", name: "Poland", nameAr: "بولندا" },
  { code: "PT", name: "Portugal", nameAr: "البرتغال" },
  { code: "QA", name: "Qatar", nameAr: "قطر" },
  { code: "RO", name: "Romania", nameAr: "رومانيا" },
  { code: "RU", name: "Russia", nameAr: "روسيا" },
  { code: "RW", name: "Rwanda", nameAr: "رواندا" },
  { code: "SA", name: "Saudi Arabia", nameAr: "السعودية" },
  { code: "SN", name: "Senegal", nameAr: "السنغال" },
  { code: "RS", name: "Serbia", nameAr: "صربيا" },
  { code: "SL", name: "Sierra Leone", nameAr: "سيراليون" },
  { code: "SG", name: "Singapore", nameAr: "سنغافورة" },
  { code: "SK", name: "Slovakia", nameAr: "سلوفاكيا" },
  { code: "SI", name: "Slovenia", nameAr: "سلوفينيا" },
  { code: "SO", name: "Somalia", nameAr: "الصومال" },
  { code: "ZA", name: "South Africa", nameAr: "جنوب أفريقيا" },
  { code: "KR", name: "South Korea", nameAr: "كوريا الجنوبية" },
  { code: "SS", name: "South Sudan", nameAr: "جنوب السودان" },
  { code: "ES", name: "Spain", nameAr: "إسبانيا" },
  { code: "LK", name: "Sri Lanka", nameAr: "سريلانكا" },
  { code: "SD", name: "Sudan", nameAr: "السودان" },
  { code: "SE", name: "Sweden", nameAr: "السويد" },
  { code: "CH", name: "Switzerland", nameAr: "سويسرا" },
  { code: "SY", name: "Syria", nameAr: "سوريا" },
  { code: "TW", name: "Taiwan", nameAr: "تايوان" },
  { code: "TJ", name: "Tajikistan", nameAr: "طاجيكستان" },
  { code: "TZ", name: "Tanzania", nameAr: "تنزانيا" },
  { code: "TH", name: "Thailand", nameAr: "تايلاند" },
  { code: "TG", name: "Togo", nameAr: "توغو" },
  { code: "TT", name: "Trinidad and Tobago", nameAr: "ترينيداد وتوباغو" },
  { code: "TN", name: "Tunisia", nameAr: "تونس" },
  { code: "TR", name: "Turkey", nameAr: "تركيا" },
  { code: "TM", name: "Turkmenistan", nameAr: "تركمانستان" },
  { code: "UG", name: "Uganda", nameAr: "أوغندا" },
  { code: "UA", name: "Ukraine", nameAr: "أوكرانيا" },
  { code: "AE", name: "United Arab Emirates", nameAr: "الإمارات العربية المتحدة" },
  { code: "GB", name: "United Kingdom", nameAr: "المملكة المتحدة" },
  { code: "US", name: "United States", nameAr: "الولايات المتحدة" },
  { code: "UY", name: "Uruguay", nameAr: "أوروغواي" },
  { code: "UZ", name: "Uzbekistan", nameAr: "أوزبكستان" },
  { code: "VE", name: "Venezuela", nameAr: "فنزويلا" },
  { code: "VN", name: "Vietnam", nameAr: "فيتنام" },
  { code: "YE", name: "Yemen", nameAr: "اليمن" },
  { code: "ZM", name: "Zambia", nameAr: "زامبيا" },
  { code: "ZW", name: "Zimbabwe", nameAr: "زيمبابوي" },
] as const;

const CODE_TO_COUNTRY = new Map(COUNTRIES.map((c) => [c.code, c]));

/** Localized display name for a country code. */
export function countryName(code: string, locale = "en"): string {
  const country = CODE_TO_COUNTRY.get(code);
  if (!country) return code;
  return locale === "ar" ? country.nameAr : country.name;
}

// Country codes that ship a real SVG flag under /public/flags. Flag emoji do
// not render on Windows (they show the letters), so prefer an image when we
// have one.
const FLAG_ASSETS = new Set(["EG"]);

/** Returns a public image path for the flag, or null to fall back to emoji. */
export function flagSrc(code: string): string | null {
  return FLAG_ASSETS.has(code.toUpperCase())
    ? `/flags/${code.toLowerCase()}.svg`
    : null;
}

/** Turns a 2-letter country code into its flag emoji (regional indicators). */
export function flagEmoji(code: string): string {
  if (code.length !== 2) return "🏳️";
  const base = 0x1f1e6;
  const chars = code
    .toUpperCase()
    .split("")
    .map((c) => base + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...chars);
}
