// Bootstrap an administrator.
//
//   npm run db:seed:admin -- you@example.com
//   npm run db:seed:admin -- you@example.com 'a-strong-password'
//
// or via the environment (handy in CI / a deploy shell):
//
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=… npm run db:seed:admin
//
// Idempotent, and safe to run against production — which is the point: an
// admin dashboard nobody can sign in to is useless, and the first admin
// cannot be promoted from inside the dashboard. It does two things and no
// more:
//
//   * an existing account is promoted to ADMIN (its password is left alone
//     unless one is passed);
//   * a missing account is created as ADMIN, with the password given or a
//     generated one printed once.
//
// Deliberately absent: any hard-coded fallback email or password. A default
// credential that ships in the repository is a back door on every deployment
// that forgets to change it, so both must be supplied explicitly.

import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// This script runs under tsx directly rather than through `prisma db seed`,
// so nothing has loaded .env yet. Existing environment variables always win.
function loadEnv() {
  let contents: string;
  try {
    contents = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  } catch {
    return; // No .env file; rely on whatever is already exported.
  }

  for (const line of contents.split("\n")) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(line);
    if (!match || line.trim().startsWith("#")) continue;

    const [, key, rawValue = ""] = match;
    if (process.env[key] !== undefined) continue;

    process.env[key] = rawValue.trim().replace(/^(['"])(.*)\1$/, "$2");
  }
}

loadEnv();

const prisma = new PrismaClient();

/** Same policy the onboarding signup enforces (see api/register). */
const MIN_PASSWORD_LENGTH = 10;

function generatePassword() {
  // 18 base64url characters — ~107 bits. Printed once, never stored in clear.
  return randomBytes(14).toString("base64url");
}

async function main() {
  const [emailArg, passwordArg] = process.argv.slice(2);
  const email = (emailArg ?? process.env.ADMIN_EMAIL ?? "").trim();
  const password = passwordArg ?? process.env.ADMIN_PASSWORD ?? null;

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error(
      "Pass the administrator's email:\n" +
        "  npm run db:seed:admin -- you@example.com\n" +
        "or set ADMIN_EMAIL in the environment.",
    );
  }

  if (password !== null && password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `The password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
  }

  // Case-insensitive, matching how sign-in and password reset resolve an
  // account — otherwise "Me@x.com" would be promoted while "me@x.com" signs in.
  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, role: true, passwordHash: true },
  });

  if (existing) {
    const hash = password ? await bcrypt.hash(password, 10) : undefined;

    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "ADMIN",
        ...(hash
          ? {
              passwordHash: hash,
              // Bumping this evicts every session that was open under the old
              // password — see the jwt callback in src/auth.ts.
              passwordChangedAt: new Date(),
            }
          : {}),
      },
    });

    console.log(
      existing.role === "ADMIN"
        ? `${existing.email} is already an admin.`
        : `Promoted ${existing.email} from ${existing.role} to ADMIN.`,
    );

    if (hash) {
      console.log("Password updated; any open sessions were signed out.");
    } else if (!existing.passwordHash) {
      console.log(
        "Note: this account has no password (it signs in with Google).",
      );
    }
    return;
  }

  const chosen = password ?? generatePassword();
  const passwordHash = await bcrypt.hash(chosen, 10);

  const created = await prisma.user.create({
    data: {
      email,
      name: "Administrator",
      passwordHash,
      role: "ADMIN",
      // Nothing has verified this address; the field records that honestly.
      emailVerified: null,
    },
    select: { email: true },
  });

  console.log(`Created administrator ${created.email}`);
  if (!password) {
    console.log(`  password: ${chosen}`);
    console.log("  ^ shown once. Store it now, then change it after signing in.");
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
