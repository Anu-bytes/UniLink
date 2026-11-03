-- Campus points for universities that had none, so they appear on the
-- "Find nearest" map. Sources: St Petersburg University in Cairo from the map
-- on its official contact page (spbu.edu.eg/contact); Al Salam University from
-- Wikidata (Q60914744), which falls on the Cairo-Alexandria Agricultural Road
-- in Gharbia, as in the university's address. Only rows still empty change.
UPDATE "University" SET "latitude" = 30.100290, "longitude" = 31.288722
WHERE "slug" = 'st-petersburg-university-cairo' AND "latitude" IS NULL;
UPDATE "University" SET "latitude" = 30.810037, "longitude" = 30.872159
WHERE "slug" = 'al-salam-university' AND "latitude" IS NULL;
