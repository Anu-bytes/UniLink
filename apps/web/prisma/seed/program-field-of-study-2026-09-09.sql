-- Migrates Program.fieldOfStudy from the ad-hoc capitalized strings used
-- when the 8 universities were first seeded (e.g. "Medicine", "Computer
-- Science") to the canonical slugs in apps/web/src/lib/fields.ts (e.g.
-- "medicine", "computer_science").
--
-- That mismatch was a real, confirmed bug across most of the site: the
-- "Filters & Eligibility" field checkboxes, the AI search bar's
-- natural-language field parsing, student-preference matching
-- (lib/matching.ts), and the faculty card's field label all key off the
-- FIELDS_OF_STUDY slug list -- none of them ever matched a real program,
-- since every seeded program stored the display string instead of the slug.
--
-- Three fields had no existing slug and were added to fields.ts alongside
-- this migration: biotechnology, health_sciences, archaeology_tourism.

BEGIN;

UPDATE "Program" SET "fieldOfStudy" = 'medicine' WHERE "fieldOfStudy" = 'Medicine';
UPDATE "Program" SET "fieldOfStudy" = 'dentistry' WHERE "fieldOfStudy" = 'Dentistry';
UPDATE "Program" SET "fieldOfStudy" = 'pharmacy' WHERE "fieldOfStudy" = 'Pharmacy';
UPDATE "Program" SET "fieldOfStudy" = 'nursing' WHERE "fieldOfStudy" = 'Nursing';
UPDATE "Program" SET "fieldOfStudy" = 'physical_therapy' WHERE "fieldOfStudy" = 'Physical Therapy';
UPDATE "Program" SET "fieldOfStudy" = 'engineering' WHERE "fieldOfStudy" = 'Engineering';
UPDATE "Program" SET "fieldOfStudy" = 'computer_science' WHERE "fieldOfStudy" = 'Computer Science';
UPDATE "Program" SET "fieldOfStudy" = 'business_administration' WHERE "fieldOfStudy" = 'Business & Economics';
UPDATE "Program" SET "fieldOfStudy" = 'languages_translation' WHERE "fieldOfStudy" = 'Languages & Translation';
UPDATE "Program" SET "fieldOfStudy" = 'mass_communication' WHERE "fieldOfStudy" = 'Media & Communication';
UPDATE "Program" SET "fieldOfStudy" = 'applied_arts' WHERE "fieldOfStudy" = 'Arts & Design';
UPDATE "Program" SET "fieldOfStudy" = 'biotechnology' WHERE "fieldOfStudy" = 'Biotechnology';
UPDATE "Program" SET "fieldOfStudy" = 'education' WHERE "fieldOfStudy" = 'Education';
UPDATE "Program" SET "fieldOfStudy" = 'arts_humanities' WHERE "fieldOfStudy" = 'Arts & Humanities';
UPDATE "Program" SET "fieldOfStudy" = 'health_sciences' WHERE "fieldOfStudy" = 'Health Sciences';
UPDATE "Program" SET "fieldOfStudy" = 'archaeology_tourism' WHERE "fieldOfStudy" = 'Archaeology & Tourism';
UPDATE "Program" SET "fieldOfStudy" = 'science' WHERE "fieldOfStudy" = 'Science';
UPDATE "Program" SET "fieldOfStudy" = 'law' WHERE "fieldOfStudy" = 'Law';

COMMIT;
