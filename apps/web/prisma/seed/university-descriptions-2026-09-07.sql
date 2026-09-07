-- Rewrites the 8 universities' short descriptions to have distinct opening
-- sentences and structure. The originals (from universities-2026-09-05.sql)
-- read fine individually but leaned on the same "Established in [year],
-- [name] is/offers..." template, most obviously for FUE and MUST, which
-- shared an identical opening clause. Facts are unchanged, still the same
-- verified established years/cities/specialties.

BEGIN;

UPDATE "University" SET description = 'Badr University in Cairo opened its doors in 2014 in Badr City on Cairo''s northeastern edge, building out a wide spread of schools from engineering and applied arts to medicine and dentistry.'
WHERE slug = 'badr-university-in-cairo';

UPDATE "University" SET description = 'An inter-governmental agreement in 2005 brought British higher education to El Shorouk City: BUE''s degrees are still validated by its UK partner universities today.'
WHERE slug = 'british-university-in-egypt';

UPDATE "University" SET description = 'Tucked into New Cairo since a 2006 presidential decree, FUE built its reputation on pharmacy, dentistry, and engineering, alongside newer computing and business programs.'
WHERE slug = 'future-university-in-egypt';

UPDATE "University" SET description = 'GUC holds a rare distinction: the first German university built outside Germany, opened in New Cairo in 2003 in partnership with the Universities of Ulm and Stuttgart.'
WHERE slug = 'german-university-in-cairo-guc';

UPDATE "University" SET description = 'MIU has run out of Km 28 on the Cairo-Ismailia Road since 1996, among the oldest of Egypt''s private universities, with business, pharmacy, and applied linguistics as its core strengths.'
WHERE slug = 'misr-international-university-miu';

UPDATE "University" SET description = 'Few private universities in Egypt match MUST''s scale: since 1996 it''s grown into one of the largest, spanning medicine, engineering, and health sciences across its 6th of October City campus.'
WHERE slug = 'misr-university-for-science-and-technology';

UPDATE "University" SET description = 'Nile University runs differently by design, a non-profit, research-first institution in Sheikh Zayed City organized into applied-science schools since 2006, rather than the traditional faculty model.'
WHERE slug = 'nile-university';

UPDATE "University" SET description = 'Egypt''s very first private university, chartered in 1996 in 6th of October City, October 6 University built its name on medicine, dentistry, and pharmacy.'
WHERE slug = 'october-6-university';

COMMIT;
