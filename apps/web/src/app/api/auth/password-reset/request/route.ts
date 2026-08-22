import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/email";
import { emailSchema, issueResetCode, CODE_TTL_MS } from "@/lib/password-reset";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { resetCodeEmail } from "@/lib/reset-email-template";

/**
 * Step 1: mail a six-digit code.
 *
 * The response is identical whether or not the address has an account, whether
 * or not the mail was accepted by the provider, and whether or not the address
 * was even well-formed. Anything else turns this endpoint into a way to test
 * which of a list of emails are registered here.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = emailSchema.safeParse(
    (body as { email?: unknown } | null)?.email,
  );

  // Per-IP first, and on its own: checking the address window too would spend
  // one of that address's three attempts on a request this IP is not allowed
  // to make, letting a blocked host burn a stranger's budget.
  if (
    !rateLimit(`pwreset:req:ip:${clientIp(req)}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    })
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // A throttled address still gets the generic 200 below: surfacing the
  // throttle would confirm the address is worth throttling.
  const addressOk =
    email.success &&
    rateLimit(`pwreset:req:acct:${email.data}`, {
      limit: 3,
      windowMs: 15 * 60_000,
    });

  if (email.success && addressOk) {
    await deliverCode(email.data);
  }

  return NextResponse.json({ ok: true });
}

async function deliverCode(email: string) {
  try {
    const issued = await issueResetCode(email);
    if (!issued) return;

    const minutes = Math.round(CODE_TTL_MS / 60_000);
    const content = resetCodeEmail({
      code: issued.code,
      name: issued.name,
      minutes,
    });

    await sendEmail({
      // The address as stored, which may differ in case from what was typed.
      to: issued.email,
      subject: `${issued.code} is your UniLink password reset code`,
      html: content.html,
      text: content.text,
    });
  } catch (error) {
    // Logged for operators, never surfaced: the caller gets the same 200 as a
    // successful send. A provider outage must not become an oracle.
    console.error("Password reset email failed", error);
  }
}
