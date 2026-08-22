import { NextResponse } from "next/server";
import { z } from "zod";

import {
  codeSchema,
  emailSchema,
  TICKET_TTL_MS,
  verifyResetCode,
} from "@/lib/password-reset";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: emailSchema,
  code: codeSchema,
});

/**
 * Step 2: exchange a correct code for a single-use ticket.
 *
 * The ticket is what authorises step 3. Letting the client simply assert "I
 * verified" would mean the final call trusted a claim the server never made.
 */
export async function POST(req: Request) {
  if (
    !rateLimit(`pwreset:verify:ip:${clientIp(req)}`, {
      limit: 30,
      windowMs: 15 * 60_000,
    })
  ) {
    return tooMany();
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return invalid();

  // A second window keyed on the address, so the per-token attempt cap cannot
  // be widened by requesting fresh codes from many IPs.
  if (
    !rateLimit(`pwreset:verify:acct:${parsed.data.email}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    })
  ) {
    return tooMany();
  }

  const ticket = await verifyResetCode(parsed.data.email, parsed.data.code);
  if (!ticket) return invalid();

  return NextResponse.json({ ticket, expiresInMs: TICKET_TTL_MS });
}

/** One message for every failure mode, so nothing is inferable from the text. */
function invalid() {
  return NextResponse.json(
    { error: "That code is not valid. Request a new one and try again." },
    { status: 400 },
  );
}

function tooMany() {
  return NextResponse.json(
    { error: "Too many attempts. Please try again later." },
    { status: 429 },
  );
}
