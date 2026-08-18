-- Faculty/university/program search (faculty-search.ts's facultyTextWhere,
-- catalog.ts's universitySearchWhere) matches free-typed words with
-- `contains`/`mode: insensitive`, i.e. ILIKE '%word%'. A plain btree index
-- can't serve that pattern, so Postgres was sequentially scanning these
-- tables on every search request. pg_trgm + GIN indexes let ILIKE use an
-- index instead.
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
