-- Restores the pg_trgm GIN indexes added in 20260818120000_search_trgm_indexes.
--
-- Those indexes are created in raw SQL and are not expressible in schema.prisma,
-- so `prisma migrate dev` reads them as drift and generates a migration that
-- DROPs all nine. If such a migration was ever applied, every ILIKE '%word%'
-- in universitySearchWhere (catalog.ts) and facultyTextWhere (faculty-search.ts)
-- went back to sequentially scanning University, Faculty and Program on every
-- search request.
--
-- Idempotent, so it is a no-op when the indexes are already in place.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Faculty_name_trgm_idx" ON "Faculty" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Faculty_nameAr_trgm_idx" ON "Faculty" USING GIN ("nameAr" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "University_name_trgm_idx" ON "University" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "University_nameAr_trgm_idx" ON "University" USING GIN ("nameAr" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "University_city_trgm_idx" ON "University" USING GIN ("city" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "University_country_trgm_idx" ON "University" USING GIN ("country" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "University_description_trgm_idx" ON "University" USING GIN ("description" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Program_name_trgm_idx" ON "Program" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Program_nameAr_trgm_idx" ON "Program" USING GIN ("nameAr" gin_trgm_ops);
