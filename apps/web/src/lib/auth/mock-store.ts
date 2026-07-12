import crypto from "node:crypto";
import type { StudentRegistration, StudentProfile } from "./types";

// ---------------------------------------------------------------------------
// In-memory MOCK user store. Swap for the real Postgres/NestJS backend later —
// the route handlers only touch these functions, so nothing else has to change.
// NOTE: resets on server restart / serverless cold start. Fine for the demo.
// ---------------------------------------------------------------------------

interface StoredStudent extends StudentProfile {
  passwordHash: string;
}

const users = new Map<string, StoredStudent>(); // key: lowercased email

function hash(password: string): string {
  // Mock hashing — replace with Argon2/bcrypt in the real backend.
  return crypto.createHash("sha256").update(`${password}::unilink-mock`).digest("hex");
}

export function emailExists(email: string): boolean {
  return users.has(email.toLowerCase());
}

export function createStudent(input: StudentRegistration): StudentProfile {
  const { password, ...rest } = input;
  const profile: StudentProfile = {
    ...rest,
    email: input.email.toLowerCase(),
    id: crypto.randomUUID(),
    role: "student",
    createdAt: new Date().toISOString(),
  };
  users.set(profile.email, { ...profile, passwordHash: hash(password) });
  return profile;
}

export function verifyCredentials(email: string, password: string): StudentProfile | null {
  const stored = users.get(email.toLowerCase());
  if (!stored || stored.passwordHash !== hash(password)) return null;
  const { passwordHash: _omit, ...profile } = stored;
  void _omit;
  return profile;
}
