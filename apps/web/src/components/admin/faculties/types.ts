import type { StudyLevel } from "@prisma/client";

/** One row of the list table; mirrors the `select` in the list page. */
export type FacultyRow = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  university: {
    id: string;
    name: string;
    nameAr: string | null;
  };
  programCount: number;
};

/** Every column the editor writes back through PATCH. */
export type FacultyDetail = {
  id: string;
  universityId: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  sortOrder: number;
};

/**
 * The faculty's children. Doubles as the `counts` object the 409 from DELETE
 * carries and as the figures the editor quotes when a move is about to repoint
 * both collections at another university.
 */
export type FacultyCounts = {
  programs: number;
  minimumScores: number;
};

/** A read-only row in the editor's programs panel. */
export type FacultyProgramRow = {
  id: string;
  name: string;
  nameAr: string | null;
  studyLevel: StudyLevel;
  isPublished: boolean;
};
