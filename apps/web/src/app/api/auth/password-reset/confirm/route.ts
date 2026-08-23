import { NextResponse } from "next/server";
import { z } from "zod";

import {
  consumeResetTicket,
  emailSchema,
  passwordSchema,
  ticketSchema,
} from "@/lib/password-reset";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: emailSchema,
  ticket: ticketSchema,
  password: passwordSchema,
});

/**
 * Step 3: set the new password against a ticket from step 2.
 *
 * Succeeding here retires every reset row for the account and moves
 * `passwordChangedAt`, which drops sessions minted before now — including any
 * an attacker still holds.
 */
export async function POST(req: Request) {
  if (
    !rateLimit(`pwreset:confirm:ip:${clientIp(req)}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    })
  ) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Password rules are the one thing worth spelling out — the user has to
    // act on them. Ticket and email problems fall through to the generic 400
    // below because there is nothing useful to say about them.
    const issue = parsed.error.issues[0];
    const message =
      issue && issue.path[0] === "password"
        ? issue.message
        : "This reset link is no longer valid. Start again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, ticket, password } = parsed.data;
  const ok = await consumeResetTicket(email, ticket, password);

  if (!ok) {
    return NextResponse.json(
      { error: "This reset link is no longer valid. Start again." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
