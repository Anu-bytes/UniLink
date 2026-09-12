-- Short free-text "About Me" shown on the profile page. Optional, so
-- existing rows don't need a backfill.
ALTER TABLE "StudentProfile" ADD COLUMN "bio" TEXT;
