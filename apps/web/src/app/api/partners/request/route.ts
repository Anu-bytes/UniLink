import { after, NextResponse } from "next/server";

import { auth } from "@/auth";
import { notifyAdminsOfPartnerRequest } from "@/lib/admin-notify";
import { partnerRequestSchema } from "@/lib/partner-request-schema";
import { MAX_OPEN_PER_EMAIL, OPEN_STATUSES } from "@/lib/partner-requests";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * The public "Work with us" form: book a demo, or apply to represent a
 * university. No sign-in required (a university considering UniLink has no
 * account yet), so it relies on the same posture as the partnership form:
 * a per-IP rate limit, a honeypot, strict validation, plus a cap on open
 * requests per email so one address cannot flood the inbox.
 */
export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Cross-site request refused" }, { status: 403 });
  }
  if (!rateLimit(`partner-request:ip:${clientIp(request)}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const raw = await request.text().catch(() => "");
  if (raw.length > 20_000) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = partnerRequestSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path?.[0] ?? null },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // A bot filled the hidden field: answer like a success, store nothing.
  if (input.website) return NextResponse.json({ ok: true }, { status: 201 });

  const open = await prisma.partnerRequest.count({
    where: { email: input.email, type: input.type, status: { in: [...OPEN_STATUSES] } },
  });
  if (open >= MAX_OPEN_PER_EMAIL) {
    return NextResponse.json(
      { error: "You already have requests waiting for a reply. We will be in touch soon.", code: "too_many_open" },
      { status: 429 },
    );
  }

  // Only a real catalogue university is linked; its stored name wins over
  // whatever the browser sent alongside the id.
  const university = input.universityId
    ? await prisma.university.findUnique({ where: { id: input.universityId }, select: { id: true, name: true } })
    : null;

  const session = await auth();
  const locale = request.headers.get("x-unilink-locale") === "ar" ? "ar" : "en";

  const created = await prisma.partnerRequest.create({
    data: {
      type: input.type,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      jobTitle: input.jobTitle,
      universityId: university?.id ?? null,
      universityName: university?.name ?? input.universityName,
      message: input.message,
      locale,
      userId: session?.user?.id ?? null,
      ...(input.type === "DEMO"
        ? {
            city: input.city,
            preferredDate: input.preferredDate ? new Date(`${input.preferredDate}T00:00:00Z`) : null,
            preferredSlot: input.preferredSlot ?? null,
            attendees: input.attendees ?? null,
          }
        : { proofUrl: input.proofUrl }),
    },
    select: { id: true, type: true, fullName: true, email: true, universityName: true, jobTitle: true },
  });

  // After the response: the applicant never waits on (or learns about) email.
  after(() =>
    notifyAdminsOfPartnerRequest(created).catch((error) => console.error("Partner request notification failed", error)),
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
