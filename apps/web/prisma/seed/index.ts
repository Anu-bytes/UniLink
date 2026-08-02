// Catalogue seed. Idempotent: universities are upserted by slug and each one's
// child rows (images, features, content blocks, faculties, programs, scores)
// are rebuilt from scratch, so re-running converges on the same state without
// touching universities the seed does not own.
//
//   npx prisma db seed --workspace=apps/web

import { PrismaClient, type Prisma } from "@prisma/client";

import {
  UNIVERSITIES,
  blocksFor,
  featuresFor,
  type ProgramSeed,
  type UniversitySeed,
} from "./data";

const prisma = new PrismaClient();

const CURRENT_YEAR = new Date().getFullYear();

/** Intakes offered by every seeded program: the next fall and the spring after. */
function intakesFor(): Prisma.ProgramIntakeCreateManyProgramInput[] {
  return [
    {
      season: "FALL",
      year: CURRENT_YEAR,
      applicationDeadline: new Date(Date.UTC(CURRENT_YEAR, 7, 15)),
    },
    {
      season: "SPRING",
      year: CURRENT_YEAR + 1,
      applicationDeadline: new Date(Date.UTC(CURRENT_YEAR + 1, 0, 10)),
    },
    {
      season: "FALL",
      year: CURRENT_YEAR + 1,
      applicationDeadline: new Date(Date.UTC(CURRENT_YEAR + 1, 7, 15)),
    },
  ];
}

/**
 * `Object.entries` over a `Partial<Record<K, V>>` types the value as
 * `V | undefined`. The seed data never stores an explicit undefined, so drop
 * them and narrow in one place instead of asserting at each call site.
 */
function entries<V>(record: Partial<Record<string, V>>): [string, V][] {
  return Object.entries(record).filter(
    (entry): entry is [string, V] => entry[1] !== undefined,
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function programData(
  program: ProgramSeed,
  universityId: string,
  facultyId: string,
): Prisma.ProgramCreateInput {
  const years = program.years ?? 4;
  const tags = program.tags ?? [];
  const waived = program.applicationFee == null;

  return {
    university: { connect: { id: universityId } },
    faculty: { connect: { id: facultyId } },
    name: program.name,
    nameAr: program.nameAr,
    slug: slugify(program.name),
    studyLevel: program.level ?? "BACHELOR",
    fieldOfStudy: program.field,
    durationMonths: years * 12,
    durationLabel: program.durationLabel ?? null,
    durationLabelAr: program.durationLabelAr ?? null,
    tuitionFee: program.tuition,
    tuitionPeriod: "YEAR",
    currency: "EGP",
    applicationFee: program.applicationFee ?? null,
    applicationFeeWaived: waived,
    minGradePercent: program.minGrade ?? null,
    coopAvailable: program.coop ?? false,
    // The waived-fee filter reads the tag, so keep it in sync with the amount.
    tags: waived ? [...new Set([...tags, "WAIVED_APPLICATION_FEE" as const])] : tags,
    isPublished: true,
    intakes: { createMany: { data: intakesFor() } },
    englishRequirements: program.english
      ? {
          createMany: {
            data: entries(program.english).map(([test, minScore]) => ({
              test: test as Prisma.ProgramEnglishRequirementCreateManyProgramInput["test"],
              minScore,
            })),
          },
        }
      : undefined,
  };
}

async function seedUniversity(seed: UniversitySeed) {
  const base = {
    name: seed.name,
    nameAr: seed.nameAr,
    type: seed.type,
    country: "Egypt",
    countryAr: "مصر",
    city: seed.city,
    cityAr: seed.cityAr,
    description: seed.description,
    descriptionAr: seed.descriptionAr,
    aboutRich: seed.aboutRich,
    aboutRichAr: seed.aboutRichAr,
    websiteUrl: seed.websiteUrl,
    coverImageUrl: seed.images[0] ?? null,
    establishedYear: seed.establishedYear,
    addressLine: seed.addressLine,
    addressLineAr: seed.addressLineAr,
    phone: seed.phone,
    email: seed.email,
    viewCount: seed.viewCount,
    isFeatured: seed.isFeatured ?? false,
    isRecommended: seed.isRecommended ?? false,
    isTrending: seed.isTrending ?? false,
    publishedAt: new Date(),
    latitude: seed.latitude,
    longitude: seed.longitude,
  } satisfies Prisma.UniversityUncheckedUpdateInput;

  const university = await prisma.university.upsert({
    where: { slug: seed.slug },
    update: base,
    create: { slug: seed.slug, ...base },
    select: { id: true },
  });

  const universityId = university.id;

  // Rebuild owned children. Programs cascade to intakes and English
  // requirements; deleting faculties would cascade to minimum scores, so both
  // are cleared explicitly first.
  await prisma.program.deleteMany({ where: { universityId } });
  await prisma.minimumScore.deleteMany({ where: { universityId } });
  await prisma.faculty.deleteMany({ where: { universityId } });
  await prisma.universityImage.deleteMany({ where: { universityId } });
  await prisma.universityFeature.deleteMany({ where: { universityId } });
  await prisma.universityContentBlock.deleteMany({ where: { universityId } });

  await prisma.universityImage.createMany({
    data: seed.images.map((url, index) => ({
      universityId,
      url,
      alt: `${seed.name} campus`,
      altAr: `حرم ${seed.nameAr}`,
      sortOrder: index,
    })),
  });

  await prisma.universityFeature.createMany({
    data: (seed.features ?? featuresFor(seed.type)).map((feature, index) => ({
      universityId,
      ...feature,
      sortOrder: index,
    })),
  });

  await prisma.universityContentBlock.createMany({
    data: (
      seed.contentBlocks ?? blocksFor(seed.type, seed.name, seed.nameAr)
    ).map((block, index) => ({
      universityId,
      ...block,
      sortOrder: index,
    })),
  });

  await prisma.minimumScore.createMany({
    data: entries(seed.minimumScores).map(([system, minScore]) => ({
      universityId,
      system: system as Prisma.MinimumScoreCreateManyInput["system"],
      minScore,
      unit: "PERCENT" as const,
      year: CURRENT_YEAR,
    })),
  });

  let programCount = 0;

  for (const [index, facultySeed] of seed.faculties.entries()) {
    const faculty = await prisma.faculty.create({
      data: {
        universityId,
        name: facultySeed.name,
        nameAr: facultySeed.nameAr,
        slug: facultySeed.slug,
        description: facultySeed.description,
        descriptionAr: facultySeed.descriptionAr,
        sortOrder: index,
      },
      select: { id: true },
    });

    for (const program of facultySeed.programs) {
      await prisma.program.create({
        data: programData(program, universityId, faculty.id),
      });
      programCount += 1;
    }
  }

  return { faculties: seed.faculties.length, programs: programCount };
}

async function main() {
  console.log(`Seeding ${UNIVERSITIES.length} universities…`);

  let faculties = 0;
  let programs = 0;

  for (const seed of UNIVERSITIES) {
    const result = await seedUniversity(seed);
    faculties += result.faculties;
    programs += result.programs;
    console.log(
      `  ${seed.slug}: ${result.faculties} faculties, ${result.programs} programs`,
    );
  }

  console.log(
    `Done. ${UNIVERSITIES.length} universities, ${faculties} faculties, ${programs} programs.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
