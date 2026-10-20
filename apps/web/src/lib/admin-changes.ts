// The review queue for university edits.
//
// Every catalogue write handler under /api/admin is exported through
// `catalogueWrite`, which decides by the caller's admin level:
//
//   level 3 (super admin)       the write runs now and is audit-logged
//   level 2 (reviewer)          refused: reviewers approve, they do not edit
//   level 1 (university admin)  checked against their assigned universities,
//                               then stored as a PENDING ChangeRequest and
//                               answered with 202, nothing written yet
//
// Approving a request replays the original call (method, path, body) through
// the same handler, inside `runAsApproval`, so an approved edit goes through
// exactly the validation and side effects a super admin's own edit would.
// Only the fields that actually differ from the record are stored, so
// approving an old request cannot overwrite unrelated edits made since.

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { ChangeAction, Prisma } from "@prisma/client";
import type { ZodTypeAny } from "zod";

import { requireAdmin, type AdminActor } from "@/lib/admin";
import { recordAudit } from "@/lib/admin-audit";
import { currentApproval, runAsApproval } from "@/lib/admin-context";
import { CATALOGUE_LISTS_TAG, UNIVERSITY_DETAIL_TAG } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export type CatalogueEntity =
  | "university"
  | "image"
  | "feature"
  | "contentBlock"
  | "minimumScore"
  | "faculty"
  | "program"
  | "intake"
  | "englishRequirement";

type Params = Record<string, string>;
type Scope = {
  universityId: string;
  entityId: string | null;
  label: string;
  before: Record<string, unknown> | null;
};

/** Prisma rows -> plain JSON (Decimal and Date become strings). */
function toJson(row: unknown): Record<string, unknown> | null {
  return row == null ? null : (JSON.parse(JSON.stringify(row)) as Record<string, unknown>);
}

async function universityName(id: string) {
  const university = await prisma.university.findUnique({ where: { id }, select: { name: true } });
  return university?.name ?? null;
}

async function programScope(programId: string) {
  return prisma.program.findUnique({
    where: { id: programId },
    select: { universityId: true, name: true },
  });
}

/**
 * Which university a write touches, a readable label for the review screen,
 * and the record as it is now. `null` means the addressed record does not
 * exist (or does not belong where the URL says), which the caller turns into
 * a 404.
 */
const RESOLVERS: Record<
  CatalogueEntity,
  (params: Params, body: Record<string, unknown> | null) => Promise<Scope | null>
> = {
  async university(params) {
    const row = await prisma.university.findUnique({ where: { id: params.id } });
    return row ? { universityId: row.id, entityId: row.id, label: row.name, before: toJson(row) } : null;
  },
  async image(params) {
    const name = await universityName(params.id);
    if (!name) return null;
    if (!params.imageId) return { universityId: params.id, entityId: null, label: `${name}: photo`, before: null };
    const row = await prisma.universityImage.findFirst({ where: { id: params.imageId, universityId: params.id } });
    return row ? { universityId: params.id, entityId: row.id, label: `${name}: photo`, before: toJson(row) } : null;
  },
  async feature(params, body) {
    const name = await universityName(params.id);
    if (!name) return null;
    if (!params.featureId) {
      return { universityId: params.id, entityId: null, label: `${name}: ${String(body?.title ?? "feature")}`, before: null };
    }
    const row = await prisma.universityFeature.findFirst({ where: { id: params.featureId, universityId: params.id } });
    return row ? { universityId: params.id, entityId: row.id, label: `${name}: ${row.title}`, before: toJson(row) } : null;
  },
  async contentBlock(params, body) {
    const name = await universityName(params.id);
    if (!name) return null;
    if (!params.blockId) {
      return { universityId: params.id, entityId: null, label: `${name}: ${String(body?.title ?? body?.section ?? "content")}`, before: null };
    }
    const row = await prisma.universityContentBlock.findFirst({ where: { id: params.blockId, universityId: params.id } });
    return row ? { universityId: params.id, entityId: row.id, label: `${name}: ${row.title ?? row.section}`, before: toJson(row) } : null;
  },
  async minimumScore(params) {
    const name = await universityName(params.id);
    if (!name) return null;
    if (!params.scoreId) return { universityId: params.id, entityId: null, label: `${name}: minimum score`, before: null };
    const row = await prisma.minimumScore.findFirst({ where: { id: params.scoreId, universityId: params.id } });
    return row ? { universityId: params.id, entityId: row.id, label: `${name}: minimum score`, before: toJson(row) } : null;
  },
  async faculty(params, body) {
    if (!params.id) {
      const universityId = typeof body?.universityId === "string" ? body.universityId : null;
      if (!universityId || !(await universityName(universityId))) return null;
      return { universityId, entityId: null, label: String(body?.name ?? "New faculty"), before: null };
    }
    const row = await prisma.faculty.findUnique({ where: { id: params.id } });
    return row ? { universityId: row.universityId, entityId: row.id, label: row.name, before: toJson(row) } : null;
  },
  async program(params, body) {
    if (!params.id) {
      const universityId = typeof body?.universityId === "string" ? body.universityId : null;
      if (!universityId || !(await universityName(universityId))) return null;
      return { universityId, entityId: null, label: String(body?.name ?? "New program"), before: null };
    }
    const row = await prisma.program.findUnique({ where: { id: params.id } });
    return row ? { universityId: row.universityId, entityId: row.id, label: row.name, before: toJson(row) } : null;
  },
  async intake(params) {
    const program = await programScope(params.id);
    if (!program) return null;
    if (!params.intakeId) return { universityId: program.universityId, entityId: null, label: `${program.name}: intake`, before: null };
    const row = await prisma.programIntake.findFirst({ where: { id: params.intakeId, programId: params.id } });
    return row ? { universityId: program.universityId, entityId: row.id, label: `${program.name}: intake`, before: toJson(row) } : null;
  },
  async englishRequirement(params) {
    const program = await programScope(params.id);
    if (!program) return null;
    if (!params.requirementId) {
      return { universityId: program.universityId, entityId: null, label: `${program.name}: English requirement`, before: null };
    }
    const row = await prisma.programEnglishRequirement.findFirst({ where: { id: params.requirementId, programId: params.id } });
    return row ? { universityId: program.universityId, entityId: row.id, label: `${program.name}: English requirement`, before: toJson(row) } : null;
  },
};

// ---------------------------------------------------------------------------
// Comparing a proposed body with the record
// ---------------------------------------------------------------------------

function normalize(value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
}

export function sameValue(a: unknown, b: unknown): boolean {
  const x = normalize(a);
  const y = normalize(b);
  if (x === y) return true;
  if (x === null || y === null) return false;
  if (typeof x === "number" || typeof y === "number") return Number(x) === Number(y);
  if (Array.isArray(x) && Array.isArray(y)) {
    return JSON.stringify([...x].map(String).sort()) === JSON.stringify([...y].map(String).sort());
  }
  if (typeof x === "object" || typeof y === "object") return JSON.stringify(x) === JSON.stringify(y);
  return String(x) === String(y);
}

/** The current value of `key` on the record, with the API's derived fields mapped back. */
export function currentValue(before: Record<string, unknown> | null, key: string): unknown {
  if (!before) return null;
  if (key === "published" && !(key in before)) return before.publishedAt != null;
  return before[key];
}

/** Keys of `payload` whose value differs from the record. */
export function changedKeys(before: Record<string, unknown> | null, payload: Record<string, unknown>) {
  return Object.keys(payload).filter((key) => !sameValue(currentValue(before, key), payload[key]));
}

// ---------------------------------------------------------------------------
// The wrapper every catalogue write is exported through
// ---------------------------------------------------------------------------

type Handler<C> = (request: Request, context: C) => Promise<Response>;

/** Largest request body a catalogue write accepts (the longest field is 20k). */
const MAX_BODY_BYTES = 200_000;
/** Changes one university admin may have waiting for review at once. */
const MAX_PENDING_PER_AUTHOR = 100;

/**
 * The public catalogue is cached (lib/catalog.ts). After a write lands, the
 * profiles are dropped at once so an editor sees their change on reload, and
 * the lists refresh in the background.
 */
function refreshCatalogueCaches() {
  revalidateTag(UNIVERSITY_DETAIL_TAG, { expire: 0 });
  revalidateTag(CATALOGUE_LISTS_TAG, "max");
}

const ACTION_VERB: Record<ChangeAction, "create" | "update" | "delete"> = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

export function catalogueWrite<C extends { params: Promise<Params> }>(
  entity: CatalogueEntity,
  action: ChangeAction,
  handler: Handler<C>,
  options: {
    superAdminOnly?: boolean;
    /**
     * The handler's own body schema. A university admin's change is checked
     * against it before it is queued, so the review queue never holds a
     * request that could not be applied (or an oversized one).
     */
    validate?: ZodTypeAny;
  } = {},
): Handler<C> {
  return async (request, context) => {
    // Replaying an approved change: run the original handler as-is.
    if (currentApproval()) {
      const response = await handler(request, context);
      if (response.ok) refreshCatalogueCaches();
      return response;
    }

    // Defence in depth on top of the SameSite session cookie: a browser marks
    // a request another site triggered, and no admin edit ever comes from one.
    if (request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ error: "Cross-site request refused" }, { status: 403 });
    }
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large" }, { status: 413 });
    }

    const guard = await requireAdmin({ minLevel: 1 });
    if (!guard.ok) return guard.response;
    const actor = guard.actor;

    if (actor.level === 2) {
      return NextResponse.json(
        { error: "Reviewers approve changes but cannot edit content directly" },
        { status: 403 },
      );
    }
    if (actor.level === 1 && options.superAdminOnly) {
      return NextResponse.json({ error: "Only a super admin can do this" }, { status: 403 });
    }

    const params = (await context?.params) ?? {};
    let body: Record<string, unknown> | null = null;
    if (action !== "DELETE") {
      // Read as text first: Content-Length can be absent (chunked uploads).
      const raw = await request.clone().text().catch(() => "");
      if (raw.length > MAX_BODY_BYTES) {
        return NextResponse.json({ error: "Request is too large" }, { status: 413 });
      }
      try {
        const parsed: unknown = JSON.parse(raw);
        body = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
      } catch {
        body = null;
      }
    }

    const scope = await RESOLVERS[entity](params, body).catch(() => null);

    if (actor.level === 3) {
      const response = await handler(request, context);
      if (response.ok) {
        const created =
          action === "CREATE" ? ((await response.clone().json().catch(() => null)) as Record<string, unknown> | null) : null;
        const label = scope?.label ?? (typeof created?.name === "string" ? created.name : entity);
        const fields = action === "UPDATE" && body ? changedKeys(scope?.before ?? null, body) : [];
        await recordAudit({
          actorId: actor.id,
          action: ACTION_VERB[action],
          entity,
          entityId: scope?.entityId ?? (typeof created?.id === "string" ? created.id : null),
          entityLabel: label,
          universityId: scope?.universityId ?? null,
          summary: describeChange(action, entity, label, fields),
          metadata: fields.length ? { fields } : undefined,
        });
        refreshCatalogueCaches();
      }
      return response;
    }

    // Level 1: queue it.
    if (!scope) return NextResponse.json({ error: "Record not found" }, { status: 404 });
    if (!actor.universityIds.includes(scope.universityId)) {
      return NextResponse.json({ error: "You can only edit the universities assigned to you" }, { status: 403 });
    }
    if (action !== "DELETE" && !body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    // The scope above is the university the record sits in now. A body that
    // names a different one (moving a faculty, say) targets that university
    // too, so it has to be assigned to this admin as well.
    const target = body?.universityId;
    if (target !== undefined && target !== null && target !== scope.universityId) {
      if (typeof target !== "string" || !actor.universityIds.includes(target)) {
        return NextResponse.json({ error: "You can only edit the universities assigned to you" }, { status: 403 });
      }
    }
    if (options.validate && body) {
      const parsed = options.validate.safeParse(body);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        return NextResponse.json(
          { error: issue?.message ?? "Invalid input", field: issue?.path?.[0] ?? null },
          { status: 400 },
        );
      }
      // Queue what the handler will actually apply (trimmed, cleaned), with
      // any keys the schema does not know dropped.
      body = parsed.data as Record<string, unknown>;
    }
    const waiting = await prisma.changeRequest.count({ where: { authorId: actor.id, status: "PENDING" } });
    if (waiting >= MAX_PENDING_PER_AUTHOR) {
      return NextResponse.json(
        { error: `You have ${waiting} changes waiting for review. Wait for some to be reviewed first.` },
        { status: 429 },
      );
    }

    let payload = body;
    if (action === "UPDATE" && body) {
      const keys = changedKeys(scope.before, body);
      if (keys.length === 0) {
        // Nothing actually changed: no request to review.
        return NextResponse.json({ ...scope.before, unchanged: true });
      }
      payload = Object.fromEntries(keys.map((key) => [key, body[key]]));
    }

    const url = new URL(request.url);
    const changeRequest = await prisma.changeRequest.create({
      data: {
        universityId: scope.universityId,
        authorId: actor.id,
        entity,
        entityId: scope.entityId,
        entityLabel: scope.label.slice(0, 300),
        action,
        method: request.method,
        path: url.pathname,
        payload: (payload ?? undefined) as Prisma.InputJsonValue | undefined,
        before: (scope.before ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });

    await recordAudit({
      actorId: actor.id,
      action: "submit",
      entity,
      entityId: scope.entityId,
      entityLabel: scope.label,
      universityId: scope.universityId,
      summary: `Sent for approval: ${describeChange(action, entity, scope.label, payload ? Object.keys(payload) : [])}`,
      metadata: { changeRequestId: changeRequest.id },
    });

    const proposed =
      action === "UPDATE"
        ? { ...scope.before, ...payload }
        : action === "CREATE"
          ? { id: `pending-${changeRequest.id}`, ...payload }
          : null;

    return NextResponse.json(
      { pending: true, changeRequestId: changeRequest.id, proposed },
      { status: 202 },
    );
  };
}

const ENTITY_NAME: Record<string, string> = {
  university: "university profile",
  image: "photo",
  feature: "feature",
  contentBlock: "content block",
  minimumScore: "minimum score",
  faculty: "faculty",
  program: "program",
  intake: "intake",
  englishRequirement: "English requirement",
};

export function describeChange(action: ChangeAction, entity: string, label: string, fields: string[]) {
  const what = ENTITY_NAME[entity] ?? entity;
  if (action === "CREATE") return `Added ${what} "${label}"`;
  if (action === "DELETE") return `Deleted ${what} "${label}"`;
  return fields.length
    ? `Edited ${what} "${label}" (${fields.slice(0, 6).join(", ")}${fields.length > 6 ? ", ..." : ""})`
    : `Edited ${what} "${label}"`;
}

// ---------------------------------------------------------------------------
// Approving: replay the stored call through its handler
// ---------------------------------------------------------------------------

type RouteModule = Record<string, unknown>;
const ROUTES: { pattern: RegExp; keys: string[]; load: () => Promise<RouteModule> }[] = [
  { pattern: /^\/api\/admin\/universities\/([^/]+)$/, keys: ["id"], load: () => import("@/app/api/admin/universities/[id]/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/images$/, keys: ["id"], load: () => import("@/app/api/admin/universities/[id]/images/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/images\/([^/]+)$/, keys: ["id", "imageId"], load: () => import("@/app/api/admin/universities/[id]/images/[imageId]/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/features$/, keys: ["id"], load: () => import("@/app/api/admin/universities/[id]/features/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/features\/([^/]+)$/, keys: ["id", "featureId"], load: () => import("@/app/api/admin/universities/[id]/features/[featureId]/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/content-blocks$/, keys: ["id"], load: () => import("@/app/api/admin/universities/[id]/content-blocks/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/content-blocks\/([^/]+)$/, keys: ["id", "blockId"], load: () => import("@/app/api/admin/universities/[id]/content-blocks/[blockId]/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/minimum-scores$/, keys: ["id"], load: () => import("@/app/api/admin/universities/[id]/minimum-scores/route") },
  { pattern: /^\/api\/admin\/universities\/([^/]+)\/minimum-scores\/([^/]+)$/, keys: ["id", "scoreId"], load: () => import("@/app/api/admin/universities/[id]/minimum-scores/[scoreId]/route") },
  { pattern: /^\/api\/admin\/faculties$/, keys: [], load: () => import("@/app/api/admin/faculties/route") },
  { pattern: /^\/api\/admin\/faculties\/([^/]+)$/, keys: ["id"], load: () => import("@/app/api/admin/faculties/[id]/route") },
  { pattern: /^\/api\/admin\/programs$/, keys: [], load: () => import("@/app/api/admin/programs/route") },
  { pattern: /^\/api\/admin\/programs\/([^/]+)$/, keys: ["id"], load: () => import("@/app/api/admin/programs/[id]/route") },
  { pattern: /^\/api\/admin\/programs\/([^/]+)\/intakes$/, keys: ["id"], load: () => import("@/app/api/admin/programs/[id]/intakes/route") },
  { pattern: /^\/api\/admin\/programs\/([^/]+)\/intakes\/([^/]+)$/, keys: ["id", "intakeId"], load: () => import("@/app/api/admin/programs/[id]/intakes/[intakeId]/route") },
  { pattern: /^\/api\/admin\/programs\/([^/]+)\/english-requirements$/, keys: ["id"], load: () => import("@/app/api/admin/programs/[id]/english-requirements/route") },
  { pattern: /^\/api\/admin\/programs\/([^/]+)\/english-requirements\/([^/]+)$/, keys: ["id", "requirementId"], load: () => import("@/app/api/admin/programs/[id]/english-requirements/[requirementId]/route") },
];

export type ReviewResult =
  | { ok: true; status: "APPROVED" | "REJECTED" | "WITHDRAWN" }
  | { ok: false; status: number; error: string };

/**
 * Approve (replay and mark APPROVED) or reject a pending request. A replay
 * the API refuses, say because the record was deleted since, leaves the
 * request pending with the reason in `applyError`, so the reviewer sees why
 * and can reject it instead.
 */
export async function reviewChangeRequest(
  reviewer: AdminActor,
  id: string,
  decision: "approve" | "reject",
  note: string | null,
  origin: string,
): Promise<ReviewResult> {
  const changeRequest = await prisma.changeRequest.findUnique({ where: { id } });
  if (!changeRequest) return { ok: false, status: 404, error: "Change request not found" };
  if (changeRequest.status !== "PENDING") {
    return { ok: false, status: 409, error: "This change has already been reviewed" };
  }

  if (decision === "reject") {
    await prisma.changeRequest.update({
      where: { id },
      data: { status: "REJECTED", reviewerId: reviewer.id, reviewNote: note, reviewedAt: new Date(), applyError: null },
    });
    await recordAudit({
      actorId: reviewer.id,
      action: "reject",
      entity: changeRequest.entity,
      entityId: changeRequest.entityId,
      entityLabel: changeRequest.entityLabel,
      universityId: changeRequest.universityId,
      summary: `Rejected: ${describeChange(changeRequest.action, changeRequest.entity, changeRequest.entityLabel, Object.keys((changeRequest.payload as object) ?? {}))}`,
      metadata: { changeRequestId: id, note },
    });
    return { ok: true, status: "REJECTED" };
  }

  const route = ROUTES.find((entry) => entry.pattern.test(changeRequest.path));
  const handler = route ? (await route.load())[changeRequest.method] : undefined;
  if (!route || typeof handler !== "function") {
    return { ok: false, status: 500, error: "This change cannot be applied automatically" };
  }

  const match = changeRequest.path.match(route.pattern)!;
  const params = Object.fromEntries(route.keys.map((key, index) => [key, match[index + 1]]));
  const replay = new Request(new URL(changeRequest.path, origin), {
    method: changeRequest.method,
    headers: { "Content-Type": "application/json" },
    body: changeRequest.method === "DELETE" || changeRequest.payload == null ? undefined : JSON.stringify(changeRequest.payload),
  });

  const response = await runAsApproval({ approver: reviewer, changeRequestId: id }, () =>
    (handler as Handler<{ params: Promise<Params> }>)(replay, { params: Promise.resolve(params) }),
  );

  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as { error?: string } | null;
    const error = detail?.error ?? `The change could not be applied (${response.status})`;
    await prisma.changeRequest.update({ where: { id }, data: { applyError: error } });
    return { ok: false, status: 422, error };
  }

  const created =
    changeRequest.action === "CREATE" ? ((await response.json().catch(() => null)) as { id?: string } | null) : null;

  await prisma.changeRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewerId: reviewer.id,
      reviewNote: note,
      reviewedAt: new Date(),
      applyError: null,
      entityId: changeRequest.entityId ?? created?.id ?? null,
    },
  });
  await recordAudit({
    actorId: reviewer.id,
    action: "approve",
    entity: changeRequest.entity,
    entityId: changeRequest.entityId ?? created?.id ?? null,
    entityLabel: changeRequest.entityLabel,
    universityId: changeRequest.universityId,
    summary: `Approved: ${describeChange(changeRequest.action, changeRequest.entity, changeRequest.entityLabel, Object.keys((changeRequest.payload as object) ?? {}))}`,
    metadata: { changeRequestId: id, note },
  });
  return { ok: true, status: "APPROVED" };
}
