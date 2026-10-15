// Two test admin accounts for trying the admin levels:
//
//   reviewer.test@unilink.test         Reviewer (level 2)
//   university-admin.test@unilink.test University admin (level 1), assigned
//                                      to Nile University and Galala University
//
//   npm run db:seed:test-admins
//
// The database is shared with the live site, so the passwords are never
// committed: each run issues new random ones (ending any open sessions) and
// writes them to test-accounts.local.md at the repo root, which is
// git-ignored. Delete the accounts from Admins in the console when done.

import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { PrismaClient, type UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

function loadEnv() {
  let contents: string;
  try {
    contents = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  } catch {
    return;
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

const ACCOUNTS: { email: string; name: string; role: UserRole; universities: string[] }[] = [
  { email: "reviewer.test@unilink.test", name: "Test Reviewer", role: "REVIEWER", universities: [] },
  {
    email: "university-admin.test@unilink.test",
    name: "Test University Admin",
    role: "UNIVERSITY_ADMIN",
    universities: ["nile-university", "galala-university"],
  },
];

function password() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(randomBytes(14), (byte) => alphabet[byte % alphabet.length]).join("");
}

async function main() {
  const lines = [
    "# UniLink test admin accounts",
    "",
    `Generated ${new Date().toISOString()} by \`npm run db:seed:test-admins\`. Private: do not commit or share.`,
    "Sign in at /login, then open /admin.",
    "",
  ];

  for (const account of ACCOUNTS) {
    const secret = password();
    const passwordHash = await bcrypt.hash(secret, 10);
    const user = await prisma.user.upsert({
      where: { email: account.email },
      create: {
        email: account.email,
        name: account.name,
        role: account.role,
        passwordHash,
        passwordChangedAt: new Date(),
        emailVerified: new Date(),
      },
      update: { name: account.name, role: account.role, status: "ACTIVE", passwordHash, passwordChangedAt: new Date() },
      select: { id: true },
    });

    const universities = await prisma.university.findMany({
      where: { slug: { in: account.universities } },
      select: { id: true, name: true },
    });
    await prisma.universityAdminAssignment.deleteMany({ where: { userId: user.id } });
    for (const university of universities) {
      await prisma.universityAdminAssignment.create({ data: { userId: user.id, universityId: university.id } });
    }

    lines.push(`## ${account.name} (${account.role === "REVIEWER" ? "Reviewer, level 2" : "University admin, level 1"})`);
    lines.push(`- Email: ${account.email}`);
    lines.push(`- Password: ${secret}`);
    if (universities.length) lines.push(`- Universities: ${universities.map((university) => university.name).join(", ")}`);
    lines.push("");
  }

  const file = resolve(process.cwd(), "../../test-accounts.local.md");
  writeFileSync(file, lines.join("\n"), "utf8");
  console.log(`Test admin accounts ready. Logins written to ${file}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
