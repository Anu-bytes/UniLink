import type { FieldOfStudyId, FeeBucketId } from "@/lib/types";
import type { HighSchoolTypeId, CertificationId } from "@/data/student";

export type UserRole = "student" | "university-admin" | "super-admin";

/** Everything the registration wizard collects (password included). */
export interface StudentRegistration {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  highSchoolType: HighSchoolTypeId;
  graduationYear: number;
  certification: CertificationId;
  fieldsOfInterest: FieldOfStudyId[]; // 1..3
  budgetBucket: FeeBucketId;
  // optional
  age?: number;
  schoolName?: string;
  nationality?: string;
  address?: string;
}

/** Stored/returned student profile (no password). */
export interface StudentProfile extends Omit<StudentRegistration, "password"> {
  id: string;
  role: "student";
  createdAt: string;
}

/** Minimal identity carried in the session cookie. */
export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}
