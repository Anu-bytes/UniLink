-- The catalog only ever covers two categories: Egypt's "national" (أهلية)
-- universities and fully private ones. Free government universities aren't
-- in scope for this platform, so PUBLIC is renamed to NATIONAL rather than
-- kept as an unused option, and SPECIALIZED is dropped entirely (0 rows use
-- it today).
ALTER TYPE "UniversityType" RENAME VALUE 'PUBLIC' TO 'NATIONAL';

-- Postgres has no DROP VALUE for enums, so removing SPECIALIZED means
-- swapping in a smaller replacement type. Safe here since no "University"
-- row uses it.
ALTER TYPE "UniversityType" RENAME TO "UniversityType_old";
CREATE TYPE "UniversityType" AS ENUM ('NATIONAL', 'PRIVATE');
ALTER TABLE "University"
  ALTER COLUMN "type" TYPE "UniversityType"
  USING ("type"::text::"UniversityType");
DROP TYPE "UniversityType_old";
