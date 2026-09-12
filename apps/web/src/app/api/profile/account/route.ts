import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { accountEditSchema } from "@/lib/onboarding-schema";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Update the signed-in user's own name.
 *
 * Email and phone are not accepted here: both double as sign-in identifiers,
 * so they stay read-only on the profile page. The update is scoped by
 * userId taken from the session, never from the request body.
 */
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = accountEditSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: issue?.message ?? "Invalid input",
        field: issue?.path?.[0] ?? null,
      },
      { status: 400 },
    );
  }

  const { firstName, lastName } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { firstName, lastName, name: `${firstName} ${lastName}` },
  });

  return NextResponse.json({ ok: true });
}
