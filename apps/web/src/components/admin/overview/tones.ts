import { ApplicationStatus, UserRole } from "@prisma/client";

import type { BadgeTone } from "@/components/admin";

/**
 * The pipeline reads as a journey, so the tiles follow the order an
 * application actually moves through rather than the size of each bucket —
 * sorting by count would reshuffle the strip on every page load.
 */
export const APPLICATION_STATUS_ORDER = [
  ApplicationStatus.DRAFT,
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.IN_REVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
] as const;

export const APPLICATION_STATUS_TONES: Record<ApplicationStatus, BadgeTone> = {
  DRAFT: "neutral",
  SUBMITTED: "blue",
  IN_REVIEW: "amber",
  OFFER: "green",
  REJECTED: "red",
  WITHDRAWN: "slate",
};

export const USER_ROLE_TONES: Record<UserRole, BadgeTone> = {
  STUDENT: "neutral",
  PARENT: "blue",
  PARTNER: "amber",
  ADMIN: "slate",
};
