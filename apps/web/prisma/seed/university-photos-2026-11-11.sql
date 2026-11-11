-- Photos and logos for universities that were missing them. Images from each
-- university's official site, plus the Beni Suef National logo from Wikimedia Commons.
BEGIN;
-- Universities with a cover but an empty gallery: show the cover in the gallery.
INSERT INTO "UniversityImage" ("id","universityId","url","alt","altAr","sortOrder")
SELECT 'img_' || substr(md5(random()::text || u."id"), 1, 20), u."id", u."coverImageUrl",
       u."name" || ' campus', COALESCE(u."nameAr", u."name") || '، الحرم الجامعي', 0
FROM "University" u
WHERE u."coverImageUrl" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u."id");

UPDATE "University" SET "logoUrl" = '/img/universities/rashid-university/logo.png' WHERE "slug" = 'rashid-university';
INSERT INTO "UniversityImage" ("id","universityId","url","alt","altAr","sortOrder")
SELECT 'img_' || substr(md5(random()::text || g.url), 1, 20), u."id", g.url, 'Rashid University campus', 'جامعة رشيد، الحرم الجامعي', g.ord
FROM "University" u, (VALUES ('/img/universities/rashid-university/gallery-campus-1.jpg', 10), ('/img/universities/rashid-university/gallery-campus-2.jpg', 11)) AS g(url, ord)
WHERE u."slug" = 'rashid-university';

UPDATE "University" SET "logoUrl" = '/img/universities/beni-suef-national-university/logo.jpg' WHERE "slug" = 'beni-suef-national-university';

UPDATE "University" SET "coverImageUrl" = '/img/universities/suez-national-university/cover.webp' WHERE "slug" = 'suez-national-university';
INSERT INTO "UniversityImage" ("id","universityId","url","alt","altAr","sortOrder")
SELECT 'img_' || substr(md5(random()::text || u."id"), 1, 20), u."id", '/img/universities/suez-national-university/cover.webp', 'Suez National University building', 'مبنى جامعة السويس الأهلية', 0
FROM "University" u WHERE u."slug" = 'suez-national-university';
COMMIT;
