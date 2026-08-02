// Local development login. Creates (or resets) a student account that already
// has a StudentProfile, which is what the match scoring in src/lib/matching.ts
// reads. An account without a profile renders program cards with no success
// chance bar, so this is the account to use when working on the app area.
//
//   npm run db:seed:user
//
// Development only: the password is committed on purpose and the script
// refuses to run against a production database.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// `prisma db seed` loads .env via the Prisma CLI, but this script runs under
// tsx directly, which does not. Load it here so DATABASE_URL is set before the
// client is constructed. Existing environment variables always win.
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

    process.env[key] = rawValue
      .trim()
      .replace(/^(['"])(.*)\1$/s, "$2");
  }
}

loadEnv();

const prisma = new PrismaClient();

const EMAIL = "student@unilink.test";
const PASSWORD = "TestStudent1";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Refusing to create the development test account in production.",
    );
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const currentYear = new Date().getFullYear();

  const profile: Omit<Prisma.StudentProfileUncheckedCreateInput, "userId"> = {
    studyLevel: "BACHELOR",
    highSchoolSystem: "THANAWEYA_AMMA",
    graduationYear: currentYear,
    // Matching parses this to a percentage, so it clears most published
    // minimums without being high enough to trivially match everything.
    gradeValue: "92",
    fieldsOfStudy: ["computer_science", "artificial_intelligence", "engineering"],
    englishTest: "IELTS",
    englishScore: 6.5,
    nationality: "EG",
    intakeSeason: "FALL",
    intakeYear: currentYear,
    budgetBand: "B100_200K",
  };

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { passwordHash },
    create: {
      email: EMAIL,
      firstName: "Test",
      lastName: "Student",
      name: "Test Student",
      phone: "+201000000000",
      passwordHash,
      role: "STUDENT",
    },
    select: { id: true },
  });

  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: profile,
    create: { userId: user.id, ...profile },
  });

  console.log("Development login ready:");
  console.log(`  email:    ${EMAIL}`);
  console.log(`  password: ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
