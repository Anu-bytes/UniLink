-- Rashid University is on the Ministry's 2026 private universities list.
UPDATE "University" SET "type" = 'PRIVATE' WHERE "slug" = (SELECT "slug" FROM "University" WHERE "name" = 'Rashid University');
