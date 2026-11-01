-- The brand is written as one word in Arabic, "يونيلينك". Three Arabic
-- testimonials used the Latin "UniLink" mid-sentence. Safe to re-run.

UPDATE "Testimonial" SET "quoteAr" = replace("quoteAr", 'UniLink', 'يونيلينك') WHERE "quoteAr" LIKE '%UniLink%';
