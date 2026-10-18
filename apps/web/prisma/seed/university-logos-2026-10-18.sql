-- Logos for 21 universities and a cover for Benha National University, from
-- their official sites (University of London and Coventry from their own
-- sites, AASTMT and Ahram Canadian from Wikimedia Commons). Fills empty fields only.

UPDATE "University" SET "logoUrl" = '/img/universities/ahram-canadian-university/logo.png' WHERE "slug" = 'ahram-canadian-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/al-hayah-university-in-cairo/logo.png' WHERE "slug" = 'al-hayah-university-in-cairo' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/al-salam-university/logo.png' WHERE "slug" = 'al-salam-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/arab-academy-for-science-technology-and-maritime-transport/logo.png' WHERE "slug" = 'arab-academy-for-science-technology-and-maritime-transport' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/badr-university-in-assiut/logo.png' WHERE "slug" = 'badr-university-in-assiut' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/badr-university-in-cairo/logo.png' WHERE "slug" = 'badr-university-in-cairo' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/badya-university/logo.png' WHERE "slug" = 'badya-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/city-university/logo.png' WHERE "slug" = 'city-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/coventry-university-egypt/logo.png' WHERE "slug" = 'coventry-university-egypt' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/future-university-in-egypt/logo.png' WHERE "slug" = 'future-university-in-egypt' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/innovation-university/logo.png' WHERE "slug" = 'innovation-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/lotus-university/logo.png' WHERE "slug" = 'lotus-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/may-university-in-cairo/logo.png' WHERE "slug" = 'may-university-in-cairo' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/memphis-university/logo.png' WHERE "slug" = 'memphis-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/merit-university/logo.png' WHERE "slug" = 'merit-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/nile-valley-university/logo.png' WHERE "slug" = 'nile-valley-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/obour-university-of-science-and-technology/logo.png' WHERE "slug" = 'obour-university-of-science-and-technology' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/ryada-university-for-science-and-technology/logo.png' WHERE "slug" = 'ryada-university-for-science-and-technology' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/sphinx-university/logo.png' WHERE "slug" = 'sphinx-university' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/university-of-east-capital/logo.png' WHERE "slug" = 'university-of-east-capital' AND COALESCE(TRIM("logoUrl"), '') = '';
UPDATE "University" SET "logoUrl" = '/img/universities/university-of-london-egypt/logo.png' WHERE "slug" = 'university-of-london-egypt' AND COALESCE(TRIM("logoUrl"), '') = '';

UPDATE "University" SET "coverImageUrl" = '/img/universities/benha-national-university/cover.jpg' WHERE "slug" = 'benha-national-university' AND COALESCE(TRIM("coverImageUrl"), '') = '';
