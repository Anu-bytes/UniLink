// Profile sections (UniversityContentBlock): the free-text sections an admin
// can add to a university's profile, shown on its "More info" tab.
//
// Stored and rendered as plain text only. The profile renders them through
// <Paragraphs>, which never interprets HTML or markdown, so nothing typed here
// can inject markup or script into the public page.
//
// Client-safe constants only; the request schemas live in
// content-block-schemas.ts so zod stays out of the browser bundle.

/** Display order of the kinds on the profile. */
export const CONTENT_SECTIONS = [
  "ABOUT_EXTRA",
  "ADMISSION_REQUIREMENTS",
  "ADMISSION_CRITERIA",
  "TUITION_NOTES",
] as const;

export type ContentSectionKind = (typeof CONTENT_SECTIONS)[number];

/** Keeps a profile, and its cached copy, a reasonable size. */
export const MAX_SECTIONS_PER_UNIVERSITY = 20;
export const MAX_SECTION_TITLE = 200;
export const MAX_SECTION_BODY = 20000;
