// Egypt's 27 governorates, used as the "City" a student in Egypt picks at
// sign-up. The English name is what gets stored, spelled the way the catalogue
// spells University.city and GOVERNORATE_DISTRICTS (lib/program-filters.ts),
// so the two can be compared when recommending nearby universities.
//
// `cities` are the main cities and districts people know a governorate by
// ("Mansoura" rather than "Dakahlia"), so searching for them finds it.

import { GOVERNORATE_DISTRICTS } from "@/lib/program-filters";

export type Governorate = { value: string; ar: string; cities: string[] };

export const EGYPT_GOVERNORATES: Governorate[] = [
  { value: "Cairo", ar: "القاهرة", cities: ["New Cairo", "Nasr City", "Heliopolis", "Maadi", "Helwan", "Shorouk", "Badr City", "New Administrative Capital", "القاهرة الجديدة", "مدينة نصر", "مصر الجديدة", "المعادي", "حلوان", "الشروق", "العاصمة الإدارية"] },
  { value: "Giza", ar: "الجيزة", cities: ["6th of October", "October", "Sheikh Zayed", "Dokki", "Haram", "6 أكتوبر", "أكتوبر", "الشيخ زايد", "الدقي", "الهرم"] },
  { value: "Alexandria", ar: "الإسكندرية", cities: ["Borg El Arab", "برج العرب"] },
  { value: "Qalyubia", ar: "القليوبية", cities: ["Banha", "Benha", "Shubra El Kheima", "Obour", "بنها", "شبرا الخيمة", "العبور"] },
  { value: "Dakahlia", ar: "الدقهلية", cities: ["Mansoura", "Gamasa", "المنصورة", "جمصة"] },
  { value: "Sharqia", ar: "الشرقية", cities: ["Zagazig", "10th of Ramadan", "الزقازيق", "العاشر من رمضان"] },
  { value: "Gharbia", ar: "الغربية", cities: ["Tanta", "El Mahalla El Kubra", "Mahalla", "طنطا", "المحلة الكبرى"] },
  { value: "Menoufia", ar: "المنوفية", cities: ["Shebin El Kom", "Sadat City", "شبين الكوم", "مدينة السادات"] },
  { value: "Beheira", ar: "البحيرة", cities: ["Damanhour", "Rashid", "Rosetta", "دمنهور", "رشيد"] },
  { value: "Kafr El Sheikh", ar: "كفر الشيخ", cities: [] },
  { value: "Damietta", ar: "دمياط", cities: ["New Damietta", "دمياط الجديدة"] },
  { value: "Port Said", ar: "بورسعيد", cities: [] },
  { value: "Ismailia", ar: "الإسماعيلية", cities: [] },
  { value: "Suez", ar: "السويس", cities: ["Ain Sokhna", "العين السخنة"] },
  { value: "North Sinai", ar: "شمال سيناء", cities: ["Arish", "العريش"] },
  { value: "South Sinai", ar: "جنوب سيناء", cities: ["Sharm El Sheikh", "El Tor", "شرم الشيخ", "الطور"] },
  { value: "Fayoum", ar: "الفيوم", cities: [] },
  { value: "Beni Suef", ar: "بني سويف", cities: [] },
  { value: "Minya", ar: "المنيا", cities: [] },
  { value: "Assiut", ar: "أسيوط", cities: [] },
  { value: "Sohag", ar: "سوهاج", cities: [] },
  { value: "Qena", ar: "قنا", cities: [] },
  { value: "Luxor", ar: "الأقصر", cities: [] },
  { value: "Aswan", ar: "أسوان", cities: [] },
  { value: "Red Sea", ar: "البحر الأحمر", cities: ["Hurghada", "الغردقة"] },
  { value: "New Valley", ar: "الوادي الجديد", cities: ["Kharga", "الخارجة"] },
  { value: "Matrouh", ar: "مطروح", cities: ["Marsa Matrouh", "New Alamein", "Alamein", "مرسى مطروح", "العلمين"] },
];

/** The city as shown to a reader: a governorate in the page's language, anything else as typed. */
export function cityLabel(city: string | null | undefined, locale: string): string | null {
  if (!city) return null;
  const governorate = EGYPT_GOVERNORATES.find((entry) => entry.value === city);
  if (!governorate) return city;
  return locale.startsWith("ar") ? governorate.ar : governorate.value;
}

/** True when `city` is one of the governorates above (not a typed city). */
export function isGovernorate(city: string | null | undefined): boolean {
  return EGYPT_GOVERNORATES.some((entry) => entry.value === city);
}

/**
 * The governorate a university's `city` is in: the district lists in
 * GOVERNORATE_DISTRICTS, or the city itself when it is a governorate's name
 * ("Fayoum", "Alexandria"). Null when unknown.
 */
export function universityGovernorate(city: string): string | null {
  for (const [governorate, info] of Object.entries(GOVERNORATE_DISTRICTS)) {
    if (info.districts.includes(city)) return governorate;
  }
  return isGovernorate(city) ? city : null;
}

// Greater Cairo is one area for getting to university: someone in Giza or
// Qalyubia commutes to New Cairo as readily as someone in Cairo does.
const AREAS: string[][] = [["Cairo", "Giza", "Qalyubia"]];

/**
 * Whether a university in `universityCity` is near a student living in
 * `studentCity`: same governorate, or the same wider area (Greater Cairo).
 * False when the student's city is not a known governorate.
 */
export function isNearStudent(studentCity: string | null | undefined, universityCity: string): boolean {
  if (!studentCity || !isGovernorate(studentCity)) return false;
  const governorate = universityGovernorate(universityCity);
  if (!governorate) return false;
  if (governorate === studentCity) return true;
  return AREAS.some((area) => area.includes(governorate) && area.includes(studentCity));
}
