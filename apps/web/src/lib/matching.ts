// Deterministic program/student matching. Produces the "success chance" bar on
// a program card and the ordering of the "Recommended for you" panel.
//
// Pure functions over plain objects so the scorer can be exercised without a
// database.

import { BUDGET_BAND_CEILING } from "@/lib/program-filters";

export type MatchBand = "PERFECT" | "STRONG" | "GOOD" | "POSSIBLE";

export type MatchResult = {
  score: number;
  band: MatchBand;
  /** Facets that pulled the score down, for the "why" tooltip. */
  gaps: MatchGap[];
};

export type MatchGap = "FIELD" | "LEVEL" | "BUDGET" | "GRADE" | "ENGLISH" | "INTAKE";

export type MatchProfile = {
  fieldsOfStudy: string[];
  studyLevel: string;
  budgetBand: string;
  gradeValue: string;
  englishTest: string;
  englishScore: number | null;
  intakeSeason: string;
  intakeYear: number;
};

export type MatchProgram = {
  fieldOfStudy: string;
  studyLevel: string;
  /** Annual tuition in EGP, or null when unpriced. */
  tuitionFee: number | null;
  minGradePercent: number | null;
  englishRequirements: { test: string; minScore: number }[];
  intakes: { season: string; year: number }[];
};

// Weights sum to 100.
const WEIGHTS = {
  field: 30,
  level: 15,
  budget: 20,
  grade: 20,
  english: 10,
  intake: 5,
} as const;

/**
 * Read a free-text grade into a percentage. Onboarding stores whatever the
 * student typed, so this handles "95", "95%", "3.7", "3.7 GPA" and "A".
 * Returns null when nothing numeric or recognisable is present.
 */
export function parseGradePercent(raw: string): number | null {
  const text = raw.trim().toLowerCase();
  if (!text) return null;

  const numeric = /(\d+(?:\.\d+)?)/.exec(text);
  if (numeric) {
    const value = Number(numeric[1]);
    if (!Number.isFinite(value)) return null;

    // A GPA is written on a 4- or 5-point scale; anything larger is a
    // percentage already.
    if (text.includes("gpa") || value <= 5) {
      const scale = value > 4 || text.includes("/5") ? 5 : 4;
      return Math.min(100, (value / scale) * 100);
    }
    return Math.min(100, value);
  }

  const letters: Record<string, number> = {
    "a+": 97, a: 93, "a-": 90,
    "b+": 87, b: 83, "b-": 80,
    "c+": 77, c: 73, "c-": 70,
    d: 65, f: 40,
  };
  return letters[text] ?? null;
}

/**
 * Score how far a student's test result clears a program's requirement, on a
 * 0-1 scale. Returns null when the program states no requirement.
 */
function englishFit(profile: MatchProfile, program: MatchProgram): number | null {
  if (program.englishRequirements.length === 0) return null;
  if (profile.englishTest === "NONE" || profile.englishScore == null) {
    // Untested students are not disqualified; most programs accept a placement
    // test instead, so this is a partial rather than a zero.
    return 0.5;
  }

  const requirement = program.englishRequirements.find(
    (entry) => entry.test === profile.englishTest,
  );
  if (!requirement) return 0.5;

  if (profile.englishScore >= requirement.minScore) return 1;
  // Within 10% of the requirement still counts for something.
  const shortfall = (requirement.minScore - profile.englishScore) / requirement.minScore;
  return shortfall <= 0.1 ? 0.6 : 0;
}

export function scoreProgram(
  profile: MatchProfile,
  program: MatchProgram,
): MatchResult {
  const gaps: MatchGap[] = [];
  let score = 0;

  // Field of study.
  if (profile.fieldsOfStudy.includes(program.fieldOfStudy)) {
    score += WEIGHTS.field;
  } else if (profile.fieldsOfStudy.length === 0) {
    score += WEIGHTS.field * 0.5;
  } else {
    gaps.push("FIELD");
  }

  // Study level.
  if (profile.studyLevel === program.studyLevel) {
    score += WEIGHTS.level;
  } else {
    gaps.push("LEVEL");
  }

  // Budget: full marks inside the band, partial up to 25% over it.
  const ceiling = BUDGET_BAND_CEILING[profile.budgetBand] ?? Number.POSITIVE_INFINITY;
  if (program.tuitionFee == null || program.tuitionFee <= ceiling) {
    score += WEIGHTS.budget;
  } else if (program.tuitionFee <= ceiling * 1.25) {
    score += WEIGHTS.budget * 0.5;
    gaps.push("BUDGET");
  } else {
    gaps.push("BUDGET");
  }

  // Grade against the program's published minimum.
  const grade = parseGradePercent(profile.gradeValue);
  if (program.minGradePercent == null) {
    score += WEIGHTS.grade;
  } else if (grade == null) {
    score += WEIGHTS.grade * 0.5;
  } else if (grade >= program.minGradePercent) {
    score += WEIGHTS.grade;
  } else if (grade >= program.minGradePercent - 3) {
    score += WEIGHTS.grade * 0.5;
    gaps.push("GRADE");
  } else {
    gaps.push("GRADE");
  }

  // English proficiency.
  const english = englishFit(profile, program);
  if (english == null) {
    score += WEIGHTS.english;
  } else {
    score += WEIGHTS.english * english;
    if (english < 1) gaps.push("ENGLISH");
  }

  // Intake availability.
  const hasIntake = program.intakes.some(
    (intake) =>
      intake.year > profile.intakeYear ||
      (intake.year === profile.intakeYear && intake.season === profile.intakeSeason),
  );
  if (hasIntake || program.intakes.length === 0) {
    score += WEIGHTS.intake;
  } else {
    gaps.push("INTAKE");
  }

  const rounded = Math.round(score);
  return { score: rounded, band: bandFor(rounded), gaps };
}

export function bandFor(score: number): MatchBand {
  if (score >= 90) return "PERFECT";
  if (score >= 75) return "STRONG";
  if (score >= 60) return "GOOD";
  return "POSSIBLE";
}

/** Tailwind colour tokens per band, shared by the card bar and compare badges. */
export const BAND_STYLES: Record<MatchBand, { bar: string; text: string; dot: string }> = {
  PERFECT: { bar: "bg-[#1E6DEB]", text: "text-[#1E6DEB]", dot: "bg-[#1E6DEB]" },
  STRONG: { bar: "bg-[#2FA36B]", text: "text-[#2FA36B]", dot: "bg-[#2FA36B]" },
  GOOD: { bar: "bg-[#E5A23C]", text: "text-[#B77714]", dot: "bg-[#E5A23C]" },
  POSSIBLE: { bar: "bg-[#98A0B4]", text: "text-[#6B7280]", dot: "bg-[#98A0B4]" },
};
