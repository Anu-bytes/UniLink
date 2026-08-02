-- The catalogue migration gave "Program"."tags" a database default so that rows
-- created before the column existed backfilled to an empty list instead of NULL.
-- That backfill has now happened, and a plain `ProgramTag[]` field in the Prisma
-- schema carries no database default, so drop it to keep the two in step.
--
-- Existing values are unaffected: DROP DEFAULT only changes what a future INSERT
-- does when the column is omitted, and Prisma always writes list columns
-- explicitly.
ALTER TABLE "Program" ALTER COLUMN "tags" DROP DEFAULT;
