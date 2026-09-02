import type {
  ApplicationStatus,
  BudgetBand,
  EnglishTest,
  HighSchoolSystem,
  IntakeSeason,
  StudyLevel,
  UserRole,
} from "@prisma/client";

/**
 * Why the role select and the delete button are locked on a given account, or
 * null when they are not. The API refuses both cases with a 409; resolving the
 * reason on the server lets the console disable the control and say why
 * instead of letting an admin click into a rejection.
 */
export type UserLock = "self" | "lastAdmin" | null;

/**
 * `self` outranks `lastAdmin`: an admin looking at their own row cannot act on
 * it whether or not anyone else holds the role, and "this is your account" is
 * the more useful sentence of the two.
 */
export function lockFor(
  user: { id: string; role: UserRole },
  actorId: string,
  adminCount: number,
): UserLock {
  if (user.id === actorId) return "self";
  if (user.role === "ADMIN" && adminCount <= 1) return "lastAdmin";
  return null;
}

/** One row of the list table; mirrors the `select` in the list page. */
export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  applicationCount: number;
  savedCount: number;
  lock: UserLock;
};

/**
 * The counts the DELETE 409 carries. Mirrors the `_count` the route selects,
 * and every one of them is a row the delete takes with it.
 */
export type UserCounts = {
  applications: number;
  savedFaculties: number;
  savedPrograms: number;
};

/**
 * The student's own onboarding answers. Read-only in the console — see the
 * note the profile card renders — so this is only ever rendered, never posted.
 */
export type UserProfile = {
  studyLevel: StudyLevel;
  highSchoolSystem: HighSchoolSystem;
  highSchoolSystemOther: string | null;
  graduationYear: number;
  gradeValue: string;
  fieldsOfStudy: string[];
  englishTest: EnglishTest;
  englishScore: number | null;
  nationality: string;
  intakeSeason: IntakeSeason;
  intakeYear: number;
  budgetBand: BudgetBand;
};

/** One application in the activity card. */
export type UserApplicationRow = {
  id: string;
  status: ApplicationStatus;
  createdAt: Date;
  submittedAt: Date | null;
  programName: string;
  programNameAr: string | null;
  universityName: string;
  universityNameAr: string | null;
};
