// Core Phase-1 read model. Mirrors the SRS entity schemas so the mock
// data layer can later be swapped for the real Postgres/PostGIS backend
// without changing consumers.

export type DegreeType = "undergraduate" | "postgraduate";

export type FieldOfStudyId =
  | "business"
  | "engineering"
  | "cs-ai-it"
  | "medicine"
  | "pharmacy"
  | "dentistry"
  | "media"
  | "arts-design"
  | "law"
  | "economics-poli"
  | "education"
  | "languages"
  | "tourism"
  | "applied-sciences"
  | "social-sciences";

export type NationalOrInternational = "national" | "international";

export type FeeBucketId =
  | "budget"
  | "mid"
  | "upper-mid"
  | "premium"
  | "elite";

/** A value stored in both languages (SRS: _en / _ar suffixes). */
export interface Bilingual {
  en: string;
  ar: string;
}

export interface FieldOfStudy {
  id: FieldOfStudyId;
  name: Bilingual;
}

export interface FeeBucket {
  id: FeeBucketId;
  label: Bilingual;
  /** EGP. null = unbounded on that side. */
  min: number | null;
  max: number | null;
}

export interface Program {
  id: string;
  name: Bilingual;
  degreeType: DegreeType;
  fieldOfStudy: FieldOfStudyId;
  minFees: number; // EGP
  maxFees: number; // EGP
  durationYears: number;
  careers?: Bilingual;
}

export interface Department {
  id: string;
  name: Bilingual;
  durationYears: number;
  programs: Program[];
}

export interface Faculty {
  id: string;
  name: Bilingual;
  fieldOfStudy: FieldOfStudyId;
  accreditation?: string[];
  admissionRequirements?: Bilingual;
  departments: Department[];
}

export interface University {
  id: string;
  slug: string;
  name: Bilingual;
  bio: Bilingual;
  address: Bilingual;
  city: Bilingual;
  governorate: Bilingual;
  lat: number;
  lng: number;
  logoUrl?: string;
  coverUrl?: string;
  accreditation: string[];
  isVerified: boolean;
  nationalOrInternational: NationalOrInternational;
  established: number;
  rating: number; // 0..5
  faculties: Faculty[];
}

// --- Query / result shapes -------------------------------------------------

export interface UniversityFilters {
  q?: string;
  field?: FieldOfStudyId[];
  degreeType?: DegreeType;
  feeBucket?: FeeBucketId[];
  minFees?: number;
  maxFees?: number;
  city?: string[]; // matches city or governorate slug-ish (lowercased en)
  nationalIntl?: NationalOrInternational;
}

export type SortKey =
  | "relevance"
  | "fees_asc"
  | "fees_desc"
  | "name"
  | "distance";

export interface UniversitySummary {
  id: string;
  slug: string;
  name: Bilingual;
  city: Bilingual;
  governorate: Bilingual;
  lat: number;
  lng: number;
  isVerified: boolean;
  nationalOrInternational: NationalOrInternational;
  rating: number;
  topFields: FieldOfStudyId[];
  programCount: number;
  facultyCount: number;
  minFees: number;
  maxFees: number;
  distanceKm?: number;
}

export interface SearchGroup {
  type: "university" | "program" | "field";
  items: SearchHit[];
}

export interface SearchHit {
  type: "university" | "program" | "field";
  id: string;
  title: Bilingual;
  subtitle?: Bilingual;
  href: string;
  fieldOfStudy?: FieldOfStudyId;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  appliedFilters: UniversityFilters & { sort?: SortKey };
}
