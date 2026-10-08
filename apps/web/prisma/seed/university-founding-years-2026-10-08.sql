-- Founding years confirmed by the client (2026-10-08): Badr University in
-- Cairo since 2010, Al Salam University since 2018. The descriptions applied
-- earlier the same day said 2013 for Badr, so its text is corrected to match;
-- Al Salam's description already said 2018, only the stat field was off.

BEGIN;

UPDATE "University"
SET "establishedYear" = 2010,
  description = replace(description, 'founded in 2013', 'founded in 2010'),
  "descriptionAr" = replace("descriptionAr", 'تأسست عام 2013', 'تأسست عام 2010')
WHERE slug = 'badr-university-in-cairo';

UPDATE "University" SET "establishedYear" = 2018
WHERE slug = 'al-salam-university';

COMMIT;
