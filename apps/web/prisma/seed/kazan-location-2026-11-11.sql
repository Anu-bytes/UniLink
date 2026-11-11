-- Kazan Federal University Cairo Branch: its own campus coordinates supplied by the user.
UPDATE "University" SET "latitude" = 30.100480597462667, "longitude" = 31.293807371734747
WHERE "slug" = (SELECT "slug" FROM "University" WHERE "name" = 'Kazan Federal University Cairo Branch');
