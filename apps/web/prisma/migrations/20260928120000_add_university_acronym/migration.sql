-- Short well-known abbreviation ("BUE", "GUC"), shown beside the university's
-- full name. Optional, so existing rows don't need a backfill.
ALTER TABLE "University" ADD COLUMN "acronym" TEXT;
