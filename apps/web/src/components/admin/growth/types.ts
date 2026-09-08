/**
 * The university filter's answer for "tied to no university at all", which the
 * list page turns into a `universityId: null` clause — the API has no query
 * parameter for it.
 *
 * It lives here, not beside the filter that renders it: every export of a
 * "use client" module reaches a server component as an opaque client
 * reference, so a page comparing `?universityId` against a constant imported
 * from one would never match, and the filter would silently return nothing.
 */
export const PLATFORM_WIDE = "none";

/** One row of the partnership lead inbox; mirrors the `select` in the list page. */
export type LeadRow = {
  id: string;
  universityName: string;
  city: string;
  contactFirstName: string;
  contactLastName: string;
  contactTitle: string;
  contactEmail: string;
  phone: string;
  createdAt: Date;
};

/**
 * A testimonial, in full. The list shows every column the editor writes, so
 * one type covers the table and the form rather than two that drift apart.
 */
export type TestimonialRow = {
  id: string;
  studentName: string;
  quote: string;
  quoteAr: string | null;
  location: string | null;
  locationAr: string | null;
  avatarUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

/** One row of the scholarships list; mirrors the `select` in the list page. */
export type ScholarshipRow = {
  id: string;
  title: string;
  titleAr: string | null;
  slug: string;
  /** Prisma's Decimal, already converted by the page: a client gets a number. */
  fundingAmount: number | null;
  currency: string;
  applicationDeadline: Date | null;
  /**
   * Decided on the server. "Is this deadline in the past" answered in the
   * browser would render differently to the server pass and trip hydration,
   * and an expired scholarship on the public site is a support ticket, so the
   * flag is worth carrying explicitly.
   */
  deadlinePassed: boolean;
  isPublished: boolean;
  /** Null for a platform-wide scholarship, and for one whose university was deleted. */
  university: { id: string; name: string; nameAr: string | null } | null;
};

/** Every column the scholarship editor writes back through POST/PATCH. */
export type ScholarshipDetail = {
  id: string;
  universityId: string | null;
  title: string;
  titleAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  fundingAmount: number | null;
  currency: string;
  applicationDeadline: Date | null;
  isPublished: boolean;
};
