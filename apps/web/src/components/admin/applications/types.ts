import type { ApplicationStatus, StudyLevel } from "@prisma/client";

import type { BadgeTone } from "@/components/admin";

/**
 * The order an application actually moves through, which is what the filter
 * chips render. Sorting them by count instead would reshuffle the whole row
 * every time an admin changed one status, so the chip under the cursor is
 * never the chip that gets clicked.
 */
export const APPLICATION_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "IN_REVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const satisfies readonly ApplicationStatus[];

/** Same mapping the overview pipeline uses; the two screens must agree. */
export const APPLICATION_STATUS_TONES: Record<ApplicationStatus, BadgeTone> = {
  DRAFT: "neutral",
  SUBMITTED: "blue",
  IN_REVIEW: "amber",
  OFFER: "green",
  REJECTED: "red",
  WITHDRAWN: "slate",
};

/**
 * `?status=` arrives as a raw query string and is fed straight into a Prisma
 * `where`, so anything outside the enum is dropped rather than trusted.
 */
export function parseStatus(
  value: string | undefined,
): ApplicationStatus | null {
  return (APPLICATION_STATUSES as readonly string[]).includes(value ?? "")
    ? (value as ApplicationStatus)
    : null;
}

/** One row of the board; mirrors the `select` in the list page. */
export type ApplicationRow = {
  id: string;
  status: ApplicationStatus;
  submittedAt: Date | null;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  program: {
    id: string;
    name: string;
    nameAr: string | null;
    university: { id: string; name: string; nameAr: string | null };
  };
};

/** The applicant as both screens show them. */
export type Applicant = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
};

export type ApplicationProgram = {
  id: string;
  name: string;
  nameAr: string | null;
  studyLevel: StudyLevel;
  university: { id: string; name: string; nameAr: string | null };
};

/**
 * `localized` in lib/catalog answers the same question, but that module builds
 * the Prisma client at import time, so importing it from the board's table
 * would ship Prisma to the browser. The other sections inline the same check
 * in their client files for the same reason.
 */
export function localizedName(
  locale: string,
  english: string,
  arabic: string | null,
) {
  return locale.startsWith("ar") && arabic ? arabic : english;
}

/**
 * An account can exist before it has a name — the address is then the only
 * thing that identifies the applicant, and it is what the overview's recent
 * list falls back to as well.
 */
export function applicantLabel(user: { name: string | null; email: string }) {
  return user.name ?? user.email;
}
