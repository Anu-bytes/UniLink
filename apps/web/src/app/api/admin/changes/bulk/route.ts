import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { readJson } from "@/lib/admin-api";
import { reviewChangeRequest } from "@/lib/admin-changes";

export const dynamic = "force-dynamic";

const schema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
  decision: z.enum(["approve", "reject"]),
  note: z.string().trim().max(1000).nullish(),
});

/**
 * Review several pending changes at once, oldest first so later edits to the
 * same record land on top of earlier ones. Each is applied on its own: one
 * that fails stays pending (with its reason) and the rest still go through.
 */
export async function POST(request: Request) {
  const guard = await requireAdmin({ minLevel: 2 });
  if (!guard.ok) return guard.response;

  const body = await readJson(request, schema);
  if (!body.ok) return body.response;

  const { prisma } = await import("@/lib/prisma");
  const ordered = await prisma.changeRequest.findMany({
    where: { id: { in: body.data.ids } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  const origin = new URL(request.url).origin;
  const results: { id: string; ok: boolean; error?: string }[] = [];
  for (const { id } of ordered) {
    const result = await reviewChangeRequest(guard.actor, id, body.data.decision, body.data.note || null, origin);
    results.push(result.ok ? { id, ok: true } : { id, ok: false, error: result.error });
  }

  return NextResponse.json({
    done: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok),
  });
}
