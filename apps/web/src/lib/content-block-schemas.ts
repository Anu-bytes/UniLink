// Request schemas for profile sections (see lib/content-blocks.ts). Shared by
// the API routes and the review queue, which checks a university admin's
// change against the same schema before queueing it.

import { z } from "zod";

import { CONTENT_SECTIONS, MAX_SECTION_BODY, MAX_SECTION_TITLE } from "@/lib/content-blocks";

// Control characters other than tab and newline have no place in copy and
// can break rendering, so they are stripped on the way in.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const text = (max: number) =>
  z
    .string()
    .transform((value) => value.replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, "").trim())
    .pipe(z.string().max(max));

export const contentBlockCreateSchema = z.object({
  section: z.enum(CONTENT_SECTIONS),
  title: text(MAX_SECTION_TITLE).nullish(),
  titleAr: text(MAX_SECTION_TITLE).nullish(),
  body: text(MAX_SECTION_BODY).pipe(z.string().min(1, "Body is required")),
  bodyAr: text(MAX_SECTION_BODY).nullish(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const contentBlockUpdateSchema = z
  .object({
    section: z.enum(CONTENT_SECTIONS),
    title: text(MAX_SECTION_TITLE).nullish(),
    titleAr: text(MAX_SECTION_TITLE).nullish(),
    body: text(MAX_SECTION_BODY).pipe(z.string().min(1, "Body is required")),
    bodyAr: text(MAX_SECTION_BODY).nullish(),
    sortOrder: z.number().int().min(0).max(9999),
  })
  .partial();
