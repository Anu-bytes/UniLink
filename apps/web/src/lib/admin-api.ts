// Shared plumbing for the `/api/admin/*` route handlers.
//
// The student-facing routes (api/saved, api/applications, api/profile/…) each
// re-implement "parse the body, safeParse it, hand back `{ error, field }` on
// failure". The admin surface has far more endpoints than that, so the same
// shape lives here once instead of being copied into every file. The wire
// format is deliberately identical to the existing routes — a 400 still reads
// `{ error, field }` — so client code written against one works against both.

import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import type { z } from "zod";

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export function badRequest(message: string, field?: string | number | null) {
  return NextResponse.json(
    { error: message, field: field ?? null },
    { status: 400 },
  );
}

export function notFound(entity = "Record") {
  return NextResponse.json({ error: `${entity} not found` }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ error: message }, { status: 409 });
}

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

export type BodyResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

/**
 * Read and validate a JSON body. Returns the first zod issue as
 * `{ error, field }`, matching how the existing routes report a bad payload,
 * so a form can highlight the offending input.
 */
export async function readJson<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
): Promise<BodyResult<z.infer<S>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false, response: badRequest("Invalid request body") };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      response: badRequest(issue?.message ?? "Invalid input", issue?.path?.[0]),
    };
  }

  return { ok: true, data: parsed.data };
}

// ---------------------------------------------------------------------------
// List parameters
// ---------------------------------------------------------------------------

export const DEFAULT_PER_PAGE = 20;
export const MAX_PER_PAGE = 100;

export type ListParams = {
  page: number;
  perPage: number;
  skip: number;
  take: number;
  /** Trimmed free-text query, or null when absent. */
  q: string | null;
  /** Raw `sort` value; each route validates it against its own allowlist. */
  sort: string | null;
  order: "asc" | "desc";
};

/**
 * Parse the pagination/search query string every admin list endpoint accepts.
 *
 * Everything is clamped rather than rejected: a hand-edited `?page=-3` should
 * show the first page, not a 400. `perPage` is capped at MAX_PER_PAGE so a
 * crafted `?perPage=100000` cannot ask the database for the whole table.
 */
export function parseListParams(request: Request): ListParams {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, toInt(searchParams.get("page"), 1));
  const perPage = Math.min(
    MAX_PER_PAGE,
    Math.max(1, toInt(searchParams.get("perPage"), DEFAULT_PER_PAGE)),
  );

  const rawQuery = searchParams.get("q")?.trim() ?? "";

  return {
    page,
    perPage,
    skip: (page - 1) * perPage,
    take: perPage,
    // Cap the length so an enormous string never reaches a LIKE query.
    q: rawQuery ? rawQuery.slice(0, 120) : null,
    sort: searchParams.get("sort"),
    order: searchParams.get("order") === "asc" ? "asc" : "desc",
  };
}

function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Read a repeatable/comma-separated filter, e.g. `?status=OFFER,IN_REVIEW`. */
export function parseEnumFilter<T extends string>(
  request: Request,
  key: string,
  allowed: readonly T[],
): T[] {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.getAll(key).flatMap((value) => value.split(","));
  const seen = new Set<string>();

  return raw
    .map((value) => value.trim())
    .filter((value): value is T => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return (allowed as readonly string[]).includes(value);
    });
}

/** Single-value query param, trimmed, or null. */
export function parseParam(request: Request, key: string): string | null {
  const value = new URL(request.url).searchParams.get(key)?.trim();
  return value ? value : null;
}

export function parseBooleanParam(
  request: Request,
  key: string,
): boolean | null {
  const value = parseParam(request, key);
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

// ---------------------------------------------------------------------------
// List responses
// ---------------------------------------------------------------------------

export type Page<T> = {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

/** Uniform envelope for every admin list endpoint. */
export function page<T>(items: T[], total: number, params: ListParams): Page<T> {
  return {
    items,
    page: params.page,
    perPage: params.perPage,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.perPage)),
  };
}

// ---------------------------------------------------------------------------
// Serialisation
// ---------------------------------------------------------------------------

/**
 * Prisma hands `Decimal` back for money and score columns. JSON.stringify
 * turns it into a string, which then silently loses to `<` and `>` on the
 * client, so every admin payload converts at the boundary — the same thing
 * lib/catalog.ts and lib/program-search.ts already do for the public pages.
 */
export function decimalToNumber(
  value: Prisma.Decimal | number | null | undefined,
): number | null {
  if (value == null) return null;
  return Number(value);
}

/** Empty string means "clear this optional column", not "store ''". */
export function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/**
 * URL-safe slug. Keeps Arabic letters (the catalogue has Arabic names) and
 * collapses everything else to single hyphens.
 */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ---------------------------------------------------------------------------
// Prisma errors
// ---------------------------------------------------------------------------

/**
 * Turn the Prisma errors an admin write can realistically hit into responses.
 * Anything else is re-thrown so it surfaces as a real 500 rather than being
 * swallowed into a misleading 4xx.
 */
export function prismaErrorResponse(
  error: unknown,
  entity = "Record",
): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint — almost always a duplicate slug.
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? (error.meta.target as string[]).join(", ")
        : "field";
      return conflict(`Another record already uses this ${target}`);
    }
    // Update/delete addressed a row that is not there.
    if (error.code === "P2025") {
      return notFound(entity);
    }
    // Foreign key — deleting something that is still referenced.
    if (error.code === "P2003") {
      return conflict(
        `${entity} is still referenced by other records and cannot be deleted`,
      );
    }
  }

  throw error;
}
