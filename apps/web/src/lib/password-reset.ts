import { randomBytes, randomInt, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

// How long a six-digit code stays usable. Short enough that a stolen mailbox
// is a narrow window, long enough to survive a slow inbox.
export const CODE_TTL_MS = 10 * 60_000;

// The ticket issued after a correct code. Its own clock, so verifying late in
// the code's life still leaves room to choose a password.
export const TICKET_TTL_MS = 10 * 60_000;

// Wrong guesses allowed against one code before the row is destroyed. Five
// guesses out of 10^6 is a 1-in-200,000 shot per issued code, and the attacker
// has to trigger a new email (itself rate limited) for another five.
export const MAX_CODE_ATTEMPTS = 5;

// Shown on the form and enforced here. Stricter than the legacy 8-char rule in
// the signup route: a reset is a fine moment to raise the floor.
export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(200, "Password must be at most 200 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const emailSchema = z.string().trim().toLowerCase().email();

// Exactly six digits. `.regex` rather than coercing to a number, so a leading
// zero survives.
export const codeSchema = z.string().trim().regex(/^\d{6}$/);

export const ticketSchema = z.string().trim().min(20).max(200);

/** Cryptographically uniform six-digit code. Never `Math.random`. */
function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** SHA-256, hex. Used for the ticket, which already has 256 bits of entropy. */
function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Resolves an address to an account, ignoring case.
 *
 * Signup stores the address exactly as it was typed, so `Seif@Gmail.com` sits
 * in the column with that capitalisation. Looking it up by the normalised form
 * would silently miss the account and leave the user waiting on an email that
 * was never sent, so the comparison has to be case-insensitive. `findFirst`
 * rather than `findUnique` because the unique index is case-sensitive and
 * cannot serve this query.
 */
async function findAccount(email: string) {
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, name: true, firstName: true },
  });
}

/**
 * Starts a reset for `email` and returns the plain code plus the address to
 * mail it to, or null when no such account exists.
 *
 * Callers must not vary their response on that null — see the request route.
 */
export async function issueResetCode(
  email: string,
): Promise<{ code: string; name: string | null; email: string } | null> {
  const user = await findAccount(email);
  if (!user) return null;

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);

  // Replacing rather than adding: one account has at most one live code, so a
  // flood of requests cannot widen the guessing surface.
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    }),
  ]);

  // The stored address, not the normalised one, so the mail goes exactly where
  // the account lives.
  return { code, name: user.firstName ?? user.name, email: user.email };
}

/**
 * Checks `code` against the live token for `email`. On success consumes the
 * code and returns a single-use ticket for the final step.
 *
 * Every failure returns null with no detail: a wrong code, an expired code, a
 * used code and an address with no account are indistinguishable to the caller.
 */
export async function verifyResetCode(
  email: string,
  code: string,
): Promise<string | null> {
  const user = await findAccount(email);

  const token = user
    ? await prisma.passwordResetToken.findFirst({
        where: {
          userId: user.id,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, codeHash: true, attempts: true },
      })
    : null;

  // Spend comparable time whether or not a token exists, so response latency
  // does not leak which addresses have an account. bcrypt.compare against a
  // throwaway hash is the cheapest way to keep the two paths similar.
  if (!token) {
    await bcrypt.compare(code, DUMMY_HASH);
    return null;
  }

  if (token.attempts >= MAX_CODE_ATTEMPTS) {
    await prisma.passwordResetToken.delete({ where: { id: token.id } });
    return null;
  }

  const valid = await bcrypt.compare(code, token.codeHash);
  if (!valid) {
    // Count the miss first, so a crash mid-request cannot hand back a free
    // guess. Deleting at the cap keeps a burnt code from lingering.
    const { attempts } = await prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { attempts: { increment: 1 } },
      select: { attempts: true },
    });
    if (attempts >= MAX_CODE_ATTEMPTS) {
      await prisma.passwordResetToken.delete({ where: { id: token.id } });
    }
    return null;
  }

  const ticket = randomBytes(32).toString("base64url");

  // `consumedAt` retires the code itself: from here the ticket is the only key,
  // and the six digits are worthless even if the mail is read later.
  await prisma.passwordResetToken.update({
    where: { id: token.id },
    data: {
      ticketHash: sha256(ticket),
      consumedAt: new Date(),
      expiresAt: new Date(Date.now() + TICKET_TTL_MS),
    },
  });

  return ticket;
}

/**
 * Sets the new password if `ticket` is the live ticket for `email`. Returns
 * false for any mismatch, without saying which part was wrong.
 *
 * On success every reset row for the account is dropped and
 * `passwordChangedAt` moves forward, which invalidates sessions issued earlier
 * (see the jwt callback in src/auth.ts).
 */
export async function consumeResetTicket(
  email: string,
  ticket: string,
  password: string,
): Promise<boolean> {
  const user = await findAccount(email);
  if (!user) return false;

  const token = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      ticketHash: sha256(ticket),
      expiresAt: { gt: new Date() },
    },
    select: { id: true, userId: true },
  });
  if (!token) return false;

  const passwordHash = await bcrypt.hash(password, 10);

  // One transaction: a password that changed without its tickets being burned
  // would leave the ticket replayable.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: token.userId },
      data: { passwordHash, passwordChangedAt: new Date() },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: token.userId } }),
  ]);

  return true;
}

// A real bcrypt hash of a value nothing will ever submit, used only to burn a
// comparable amount of time on the "no such account" path above.
const DUMMY_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
