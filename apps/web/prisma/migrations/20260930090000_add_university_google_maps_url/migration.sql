-- A Google Maps link per university, for those with no coordinates on file.
-- Optional, so existing rows don't need a backfill.
ALTER TABLE "University" ADD COLUMN "googleMapsUrl" TEXT;
