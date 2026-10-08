// Minimum admission percentages ("الحدود الدنيا") published for the 2026/2027
// academic year, applied to programs by field of study.
//
// Two sets of tables: private universities and national (ahleya)
// universities, each published once for Thanaweya Amma / Al-Azhar / STEM /
// Nile schools and once for Arab and foreign equivalent certificates. A
// program with its own `minGradePercent` in the database keeps that value:
// these limits only fill in programs that have none.
//
// Pure data and functions, so pages, search and matching all read the same
// numbers.

export const ADMISSION_LIMITS_YEAR = "2026/2027";

/**
 * The two published tables: one for Thanaweya Amma, Al-Azhar, STEM and Nile
 * schools, one for Arab and foreign equivalent certificates.
 */
export type CertificateGroup = "EGYPTIAN" | "EQUIVALENT";

export const CERTIFICATE_GROUPS: readonly CertificateGroup[] = ["EGYPTIAN", "EQUIVALENT"];

/** Sinai University publishes separate limits for its two campuses. */
export type Branch = "ARISH" | "QANTARA";

export const ADMISSION_CATEGORIES = [
  "MEDICINE",
  "DENTISTRY",
  "PHYSICAL_THERAPY",
  "PHARMACY",
  "VETERINARY",
  "ENGINEERING",
  "PETROLEUM_ENGINEERING",
  "COMPUTING",
  "COMPUTER_SCIENCE_IN_SCIENCE",
  "SCIENCES_HEALTH",
  "ARTS_HUMANITIES",
  "TECHNOLOGICAL_UNIVERSITIES",
] as const;

export type AdmissionCategory = (typeof ADMISSION_CATEGORIES)[number];

type Pair = { EGYPTIAN: number | null; EQUIVALENT: number | null };
const pair = (egyptian: number | null, equivalent: number | null): Pair => ({
  EGYPTIAN: egyptian,
  EQUIVALENT: equivalent,
});

// "باقي الجامعات الخاصة": every private university without its own column.
const PRIVATE_DEFAULT: Record<AdmissionCategory, Pair> = {
  MEDICINE: pair(81, 85),
  DENTISTRY: pair(77, 82),
  PHYSICAL_THERAPY: pair(75, 78),
  PHARMACY: pair(71, 73),
  VETERINARY: pair(66, 60),
  ENGINEERING: pair(67, 70),
  PETROLEUM_ENGINEERING: pair(67, 70),
  COMPUTING: pair(60, 65),
  COMPUTER_SCIENCE_IN_SCIENCE: pair(60, 65),
  SCIENCES_HEALTH: pair(55, 58),
  ARTS_HUMANITIES: pair(53, 58),
  TECHNOLOGICAL_UNIVERSITIES: pair(52, 57),
};

const NONE = pair(null, null);

// Sinai University, per campus. Categories a campus does not offer are null.
const SINAI: Record<Branch, Record<AdmissionCategory, Pair>> = {
  ARISH: {
    MEDICINE: NONE,
    DENTISTRY: pair(73, 75),
    PHYSICAL_THERAPY: NONE,
    PHARMACY: pair(68, 66),
    VETERINARY: NONE,
    ENGINEERING: pair(64, 63),
    PETROLEUM_ENGINEERING: NONE,
    COMPUTING: pair(58, 60),
    COMPUTER_SCIENCE_IN_SCIENCE: NONE,
    SCIENCES_HEALTH: pair(53, 58),
    ARTS_HUMANITIES: pair(52, 58),
    TECHNOLOGICAL_UNIVERSITIES: NONE,
  },
  QANTARA: {
    MEDICINE: NONE,
    DENTISTRY: pair(73, 77),
    PHYSICAL_THERAPY: pair(72, 73),
    PHARMACY: pair(68, 68),
    VETERINARY: NONE,
    ENGINEERING: pair(64, 65),
    PETROLEUM_ENGINEERING: NONE,
    COMPUTING: pair(58, 60),
    COMPUTER_SCIENCE_IN_SCIENCE: NONE,
    SCIENCES_HEALTH: pair(53, 58),
    ARTS_HUMANITIES: pair(53, 58),
    TECHNOLOGICAL_UNIVERSITIES: NONE,
  },
};

const SINAI_SLUG = "sinai-university";

// The arts and humanities group is 55% (not 53%) at these four, for the
// Thanaweya Amma table only.
const ARTS_55_SLUGS = new Set([
  "october-6-university",
  "misr-university-for-science-and-technology",
  "msa-university",
  "misr-international-university-miu",
]);

// Technological universities with their own row (El Sewedy, Saxony): one
// limit for every program. Matched loosely so a future slug still hits.
const TECHNOLOGICAL_SLUG = /sewedy|saxony/i;

// National (ahleya) universities. Their table has no petroleum-engineering,
// computer-science-in-science or technological-university rows; petroleum
// engineering is an engineering program and computer science is computing,
// so those two fall back to the general row (see nationalLimits).
type NationalCategory = Exclude<
  AdmissionCategory,
  "PETROLEUM_ENGINEERING" | "COMPUTER_SCIENCE_IN_SCIENCE" | "TECHNOLOGICAL_UNIVERSITIES"
>;

// "باقي الجامعات الأهلية".
const NATIONAL_DEFAULT: Record<NationalCategory, Pair> = {
  MEDICINE: pair(85, 90),
  DENTISTRY: pair(79, 82),
  PHYSICAL_THERAPY: pair(77, 78),
  PHARMACY: pair(72, 73),
  ENGINEERING: pair(68, 70),
  VETERINARY: pair(67, 65),
  COMPUTING: pair(61, 65),
  SCIENCES_HEALTH: pair(56, 58),
  ARTS_HUMANITIES: pair(53, 58),
};

// Galala, New Alamein International and East Port Said National.
const NATIONAL_GALALA_GROUP: Record<NationalCategory, Pair> = {
  MEDICINE: pair(82, 88),
  DENTISTRY: pair(75, 77),
  PHYSICAL_THERAPY: pair(74, 73),
  PHARMACY: pair(70, 68),
  ENGINEERING: pair(65, 65),
  VETERINARY: pair(65, null),
  COMPUTING: pair(59, 60),
  SCIENCES_HEALTH: pair(54, 58),
  ARTS_HUMANITIES: pair(53, 58),
};

// King Salman International and New Valley National.
const NATIONAL_KING_SALMAN_GROUP: Record<NationalCategory, Pair> = {
  MEDICINE: pair(80, 85),
  DENTISTRY: pair(73, 75),
  PHYSICAL_THERAPY: pair(72, 71),
  PHARMACY: pair(68, 66),
  ENGINEERING: pair(64, 63),
  VETERINARY: pair(64, 65),
  COMPUTING: pair(58, 60),
  SCIENCES_HEALTH: pair(53, 58),
  ARTS_HUMANITIES: pair(52, 58),
};

// Matched loosely, so the two not yet in the catalogue (East Port Said
// National, New Valley National) pick up their column once added.
const GALALA_GROUP = /^(galala-university|new-alamein-international-university)$|east-port-said/i;
const KING_SALMAN_GROUP = /^king-salman-international-university$|new-valley/i;

// Zewail City admits through its own process rather than the ahleya
// coordination, so the ahleya table is not shown for it.
const NATIONAL_EXCLUDED = new Set(["zewail-city-of-science-technology-and-innovation"]);

function nationalLimits(universitySlug: string, category: AdmissionCategory): Pair {
  if (category === "TECHNOLOGICAL_UNIVERSITIES") return NONE;
  const row: NationalCategory =
    category === "PETROLEUM_ENGINEERING"
      ? "ENGINEERING"
      : category === "COMPUTER_SCIENCE_IN_SCIENCE"
        ? "COMPUTING"
        : category;
  const table = GALALA_GROUP.test(universitySlug)
    ? NATIONAL_GALALA_GROUP
    : KING_SALMAN_GROUP.test(universitySlug)
      ? NATIONAL_KING_SALMAN_GROUP
      : NATIONAL_DEFAULT;
  return table[row];
}

const FIELD_CATEGORY: Record<string, AdmissionCategory> = {
  medicine: "MEDICINE",
  dentistry: "DENTISTRY",
  physical_therapy: "PHYSICAL_THERAPY",
  pharmacy: "PHARMACY",
  veterinary: "VETERINARY",
  engineering: "ENGINEERING",
  architecture: "ENGINEERING",
  computer_science: "COMPUTING",
  information_technology: "COMPUTING",
  artificial_intelligence: "COMPUTING",
  biotechnology: "SCIENCES_HEALTH",
  health_sciences: "SCIENCES_HEALTH",
  science: "SCIENCES_HEALTH",
  nursing: "SCIENCES_HEALTH",
  applied_arts: "ARTS_HUMANITIES",
  fine_arts: "ARTS_HUMANITIES",
  agriculture: "ARTS_HUMANITIES",
  education: "ARTS_HUMANITIES",
  arts_humanities: "ARTS_HUMANITIES",
  languages_translation: "ARTS_HUMANITIES",
  economics_political_science: "ARTS_HUMANITIES",
  business_administration: "ARTS_HUMANITIES",
  law: "ARTS_HUMANITIES",
  tourism_hotels: "ARTS_HUMANITIES",
  archaeology_tourism: "ARTS_HUMANITIES",
  // Not in the published table, so deliberately unmapped: mass_communication.
};

/** Which published table a student's certificate is judged against. */
export function certificateGroupFor(system: string | null | undefined): CertificateGroup | null {
  switch (system) {
    case "THANAWEYA_AMMA":
    case "AL_AZHAR":
    case "STEM":
      return "EGYPTIAN";
    case "IGCSE":
    case "AMERICAN_DIPLOMA":
    case "ARAB_CERTIFICATE":
      return "EQUIVALENT";
    default:
      return null;
  }
}

export type AdmissionLimit = {
  category: AdmissionCategory;
  /** Set for Sinai University programs named after a campus. */
  branch: Branch | null;
  EGYPTIAN: number | null;
  EQUIVALENT: number | null;
};

export type AdmissionLimitInput = {
  universitySlug: string;
  universityType: string;
  fieldOfStudy: string;
  /** English program name: used for campus names and petroleum engineering. */
  programName: string;
};

export function categoryFor(input: AdmissionLimitInput): AdmissionCategory | null {
  if (input.universityType === "PRIVATE" && TECHNOLOGICAL_SLUG.test(input.universitySlug)) {
    return "TECHNOLOGICAL_UNIVERSITIES";
  }
  if (input.fieldOfStudy === "engineering" && /petroleum/i.test(input.programName)) {
    return "PETROLEUM_ENGINEERING";
  }
  if (input.fieldOfStudy === "science" && /computer/i.test(input.programName)) {
    return "COMPUTER_SCIENCE_IN_SCIENCE";
  }
  return FIELD_CATEGORY[input.fieldOfStudy] ?? null;
}

export function branchFor(programName: string): Branch | null {
  if (/arish/i.test(programName)) return "ARISH";
  if (/qantara/i.test(programName)) return "QANTARA";
  return null;
}

/** Whether the published tables apply to a university at all. */
export function isCoveredUniversity(university: { slug: string; type: string }): boolean {
  if (university.type === "PRIVATE") return true;
  return university.type === "NATIONAL" && !NATIONAL_EXCLUDED.has(university.slug);
}

/** The published limits for one category at a university (and campus). */
export function limitsForCategory(
  university: { slug: string; type: string },
  category: AdmissionCategory,
  branch: Branch | null = null,
): Pair {
  if (!isCoveredUniversity(university)) return NONE;
  if (university.type === "NATIONAL") return nationalLimits(university.slug, category);
  const universitySlug = university.slug;
  if (universitySlug === SINAI_SLUG) {
    if (branch) return SINAI[branch][category];
    // A Sinai program not tied to a campus: the lower of the two campuses,
    // which is enough to qualify at one of them.
    const arish = SINAI.ARISH[category];
    const qantara = SINAI.QANTARA[category];
    const lower = (a: number | null, b: number | null) =>
      a == null ? b : b == null ? a : Math.min(a, b);
    return pair(lower(arish.EGYPTIAN, qantara.EGYPTIAN), lower(arish.EQUIVALENT, qantara.EQUIVALENT));
  }
  const base = PRIVATE_DEFAULT[category];
  if (category === "ARTS_HUMANITIES" && ARTS_55_SLUGS.has(universitySlug)) {
    return pair(55, base.EQUIVALENT);
  }
  return base;
}

/**
 * The published limit for one program, or null when the university is not
 * covered or the field is not in the table.
 */
export function admissionLimitFor(input: AdmissionLimitInput): AdmissionLimit | null {
  const university = { slug: input.universitySlug, type: input.universityType };
  if (!isCoveredUniversity(university)) return null;
  const category = categoryFor(input);
  if (!category) return null;
  const branch =
    input.universityType === "PRIVATE" && input.universitySlug === SINAI_SLUG
      ? branchFor(input.programName)
      : null;
  const limits = limitsForCategory(university, category, branch);
  if (limits.EGYPTIAN == null && limits.EQUIVALENT == null) return null;
  return { category, branch, ...limits };
}

/**
 * The minimum that applies to a student. With no known certificate group the
 * stricter of the two is used, so a match is never overstated.
 */
export function minimumForGroup(
  limit: Pick<AdmissionLimit, "EGYPTIAN" | "EQUIVALENT">,
  group: CertificateGroup | null,
): number | null {
  if (group) return limit[group] ?? null;
  const values = [limit.EGYPTIAN, limit.EQUIVALENT].filter((v): v is number => v != null);
  return values.length ? Math.max(...values) : null;
}

/**
 * A program's minimum for one viewer. A value stored on the program itself
 * (entered by an admin) wins and applies to every certificate; otherwise the
 * published limit is used, for the viewer's certificate group. Pass
 * `group: null` for an unknown certificate (the stricter value is used).
 */
export function resolveMinGrade(
  program: { minGradePercent: number | null; fieldOfStudy: string; name: string },
  university: { slug: string; type: string },
  group: CertificateGroup | null,
): { minGradePercent: number | null; admissionLimit: AdmissionLimit | null } {
  if (program.minGradePercent != null) {
    return { minGradePercent: program.minGradePercent, admissionLimit: null };
  }
  const admissionLimit = admissionLimitFor({
    universitySlug: university.slug,
    universityType: university.type,
    fieldOfStudy: program.fieldOfStudy,
    programName: program.name,
  });
  return {
    minGradePercent: admissionLimit ? minimumForGroup(admissionLimit, group) : null,
    admissionLimit,
  };
}

/**
 * For public pages, where the visitor's certificate is unknown: the
 * Thanaweya Amma limit is the headline number (the equivalent-certificates
 * one when that is all there is), and the full limit travels alongside so the
 * page can show both.
 */
export function headlineMinGrade(
  program: { minGradePercent: number | null; fieldOfStudy: string; name: string },
  university: { slug: string; type: string },
): { minGradePercent: number | null; admissionLimit: AdmissionLimit | null } {
  const { minGradePercent, admissionLimit } = resolveMinGrade(program, university, "EGYPTIAN");
  return {
    minGradePercent: minGradePercent ?? admissionLimit?.EQUIVALENT ?? null,
    admissionLimit,
  };
}

/**
 * Every category with a published limit at a university, for showing its
 * whole table when its programs aren't in the catalogue yet. Rows that would
 * only repeat another (national petroleum/science-computing fall back to the
 * general rows) or that belong to other universities (the technological row)
 * are left out.
 */
export function publishedCategoriesFor(university: { slug: string; type: string }): AdmissionCategory[] {
  if (!isCoveredUniversity(university)) return [];
  return ADMISSION_CATEGORIES.filter((category) => {
    if (category === "TECHNOLOGICAL_UNIVERSITIES" && !TECHNOLOGICAL_SLUG.test(university.slug)) return false;
    if (
      university.type === "NATIONAL" &&
      (category === "PETROLEUM_ENGINEERING" || category === "COMPUTER_SCIENCE_IN_SCIENCE")
    ) {
      return false;
    }
    const limits = limitsForCategory(university, category);
    return limits.EGYPTIAN != null || limits.EQUIVALENT != null;
  });
}
