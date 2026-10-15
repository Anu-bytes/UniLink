// Builds what the approvals screen shows for each change request: the fields
// it touches, with the value when the request was made, the live value now,
// and the proposed value. A field whose live value moved since the request
// was made is flagged, so a reviewer notices before overwriting someone
// else's newer edit.

import type { ChangeAction, ChangeRequestStatus, Prisma } from "@prisma/client";

import { currentValue, sameValue } from "@/lib/admin-changes";
import { prisma } from "@/lib/prisma";

export type ReviewField = {
  key: string;
  /** Value when the request was made (UPDATE/DELETE). */
  before: unknown;
  /** Value right now (UPDATE/DELETE); null when the record is gone. */
  current: unknown;
  /** What the request would set (CREATE/UPDATE). */
  proposed: unknown;
  /** The record changed since the request was made. */
  stale: boolean;
};

export type ReviewItem = {
  id: string;
  action: ChangeAction;
  entity: string;
  entityLabel: string;
  status: ChangeRequestStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
  applyError: string | null;
  university: { id: string; name: string; nameAr: string | null; slug: string };
  author: { id: string; name: string | null; email: string } | null;
  reviewer: { name: string | null; email: string } | null;
  /** UPDATE/DELETE whose record no longer exists. */
  missing: boolean;
  fields: ReviewField[];
};

const HIDDEN_KEYS = new Set([
  "id",
  "universityId",
  "programId",
  "createdAt",
  "updatedAt",
  "viewCount",
  "publishedAt",
]);

/** For a DELETE, the few fields that tell a reviewer what is being removed. */
const IDENTITY_KEYS = [
  "name",
  "nameAr",
  "title",
  "titleAr",
  "url",
  "section",
  "system",
  "minScore",
  "season",
  "year",
  "test",
  "tuitionFee",
];

type Row = { id: string } & Record<string, unknown>;

const LOADERS: Record<string, (ids: string[]) => Promise<Row[]>> = {
  university: (ids) => prisma.university.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  image: (ids) => prisma.universityImage.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  feature: (ids) => prisma.universityFeature.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  contentBlock: (ids) => prisma.universityContentBlock.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  minimumScore: (ids) => prisma.minimumScore.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  faculty: (ids) => prisma.faculty.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  program: (ids) => prisma.program.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  intake: (ids) => prisma.programIntake.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
  englishRequirement: (ids) => prisma.programEnglishRequirement.findMany({ where: { id: { in: ids } } }) as Promise<Row[]>,
};

function asJson(row: unknown): Record<string, unknown> | null {
  return row == null ? null : (JSON.parse(JSON.stringify(row)) as Record<string, unknown>);
}

export async function buildReviewItems(where: Prisma.ChangeRequestWhereInput, take = 50, skip = 0) {
  const [requests, total] = await prisma.$transaction([
    prisma.changeRequest.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take,
      skip,
      include: {
        university: { select: { id: true, name: true, nameAr: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
        reviewer: { select: { name: true, email: true } },
      },
    }),
    prisma.changeRequest.count({ where }),
  ]);

  // Live records, one query per kind.
  const byEntity = new Map<string, Set<string>>();
  for (const request of requests) {
    if (request.entityId && request.action !== "CREATE") {
      if (!byEntity.has(request.entity)) byEntity.set(request.entity, new Set());
      byEntity.get(request.entity)!.add(request.entityId);
    }
  }
  const live = new Map<string, Record<string, unknown>>();
  for (const [entity, ids] of byEntity) {
    const rows = await (LOADERS[entity]?.([...ids]) ?? Promise.resolve([]));
    for (const row of rows) live.set(`${entity}:${row.id}`, asJson(row)!);
  }

  // Faculty ids shown as names.
  const facultyIds = new Set<string>();
  for (const request of requests) {
    for (const source of [request.payload, request.before]) {
      const id = (source as Record<string, unknown> | null)?.facultyId;
      if (typeof id === "string") facultyIds.add(id);
    }
  }
  const facultyNames = new Map(
    (await prisma.faculty.findMany({ where: { id: { in: [...facultyIds] } }, select: { id: true, name: true } })).map(
      (faculty) => [faculty.id, faculty.name],
    ),
  );
  const show = (key: string, value: unknown) =>
    key === "facultyId" && typeof value === "string" ? (facultyNames.get(value) ?? value) : value;

  const items: ReviewItem[] = requests.map((request) => {
    const payload = (request.payload as Record<string, unknown> | null) ?? {};
    const before = (request.before as Record<string, unknown> | null) ?? null;
    const current = request.entityId ? (live.get(`${request.entity}:${request.entityId}`) ?? null) : null;
    const missing = request.action !== "CREATE" && current === null;

    let keys: string[];
    if (request.action === "DELETE") {
      keys = IDENTITY_KEYS.filter((key) => before && before[key] != null);
    } else {
      keys = Object.keys(payload);
    }
    keys = keys.filter((key) => !HIDDEN_KEYS.has(key));

    const fields: ReviewField[] = keys.map((key) => {
      const was = currentValue(before, key);
      const now = currentValue(current, key);
      return {
        key,
        before: show(key, was),
        current: show(key, now),
        proposed: request.action === "DELETE" ? null : show(key, payload[key]),
        stale: request.status === "PENDING" && request.action === "UPDATE" && !missing && !sameValue(was, now),
      };
    });

    return {
      id: request.id,
      action: request.action,
      entity: request.entity,
      entityLabel: request.entityLabel,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
      reviewedAt: request.reviewedAt?.toISOString() ?? null,
      reviewNote: request.reviewNote,
      applyError: request.applyError,
      university: request.university,
      author: request.author,
      reviewer: request.reviewer,
      missing,
      fields,
    };
  });

  return { items, total };
}
