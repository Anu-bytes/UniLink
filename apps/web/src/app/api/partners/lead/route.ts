import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  universityName: z.string().trim().min(2).max(200),
  city: z.string().trim().min(2).max(100),
  contactFirstName: z.string().trim().min(1).max(80),
  contactLastName: z.string().trim().min(1).max(80),
  contactEmail: z.string().trim().email().max(200),
  contactTitle: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  message: z.string().trim().max(2000).optional(),
  // Honeypot: a field real visitors never see (hidden via CSS) or fill in.
  // Not validated strictly on purpose. A bot that fills it gets a normal
  // 201 response with nothing stored, rather than a 400 that would tip it
  // off to try again differently.
  website: z.string().optional(),
});

/**
 * Public partnership-request lead form on /contact. No auth (anyone
 * considering a partnership hasn't signed up yet), so it leans on rate
 * limiting plus the honeypot instead, same posture as /api/register.
 */
export async function POST(request: Request) {
  if (
    !rateLimit(`partner-lead:ip:${clientIp(request)}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    })
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path?.[0] ?? null },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const {
    universityName,
    city,
    contactFirstName,
    contactLastName,
    contactEmail,
    contactTitle,
    phone,
    message,
  } = parsed.data;

  await prisma.partnershipLead.create({
    data: {
      universityName,
      city,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactTitle,
      phone,
      message: message || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
