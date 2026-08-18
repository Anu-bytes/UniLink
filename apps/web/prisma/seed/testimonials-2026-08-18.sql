-- Five student/parent reviews from "آراء الطلاب.docx" (2026-08-18), added to
-- the homepage's Featured Reviews (Testimonial table). Quote/location are the
-- English copy shown by default; quoteAr/locationAr are the original Arabic,
-- shown when the site is in Arabic (see localized() in src/lib/catalog.ts).
--
-- One-off content insert, not a schema change: run once by hand (Supabase
-- SQL editor, or `psql "$DIRECT_URL" -f this-file.sql`). Not part of
-- prisma/migrations and not idempotent, re-running it will duplicate rows.
INSERT INTO "Testimonial"
  ("id", "studentName", "quote", "quoteAr", "location", "locationAr", "sortOrder", "isPublished", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid()::text,
    'Dalia Mahmoud',
    'What I liked most was that all the information was clear and gathered in one place. As a mother, it mattered to me to understand the differences between universities, majors, and fees before helping my daughter make her decision. UniLink made our whole search and decision journey so much easier.',
    'أكتر حاجة عجبتني إن المعلومات كانت واضحة ومجمعة في مكان واحد. أنا كأم كان مهم بالنسبة لي أعرف الفرق بين الجامعات والتخصصات والمصاريف قبل ما أساعد بنتي تاخد قرارها. ويونيلينك سهلت علينا رحلة البحث والاختيار جدًا',
    'Parent, Thanaweya Amma',
    'ولي أمر، الثانوية العامة',
    0,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid()::text,
    'Gana Youssef',
    'I loved that everything was gathered in one simple, clear place instead of having to check each university''s website separately. I could easily compare my options. Really, thank you to the team behind this platform.',
    'عجبني المعلومات متجمعة بشكل بسيط وواضح بدل ما أفضل أدخل على موقع كل جامعة لوحدها. قدرت أقارن الاختيارات قدامي بسهولة. بجد شكرًا للقائمين على المنصة دي',
    'Student, IGCSE',
    'طالبة، IGCSE',
    1,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid()::text,
    'Youssef Khaled',
    'I already knew what major I wanted, but I was stuck on choosing which university. Comparing on UniLink helped me understand the differences between universities and narrow down the right choices for me.',
    'أنا كنت عارف التخصص اللي عايزه بس محتار أختار أنهي جامعة. المقارنة على UniLink ساعدتني أفهم الفرق بين الجامعات وأحدد الاختيارات المناسبة ليا',
    'Student, Thanaweya Amma',
    'طالب، الثانوية العامة',
    2,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid()::text,
    'Malak Abdelrahman',
    'UniLink made the research phase so much easier, especially since every university has so many details. The platform kept everything organized and made deciding much simpler.',
    'UniLink سهلت عليا مرحلة البحث خصوصًا إن كل جامعة ليها تفاصيل كتير والمنصة خلت الموضوع منظم وأسهل في اتخاذ القرار',
    'Student, American Diploma',
    'طالبة، American Diploma',
    3,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid()::text,
    'Omar Mohamed',
    'Instead of asking a lot of people and gathering information from different places, I found most of what I needed in one spot. It felt like UniLink was a guide helping me make a smarter university decision.',
    'بدل ما أسأل ناس كتير وأجمع معلومات من كذا مكان، لقيت معظم اللي محتاجه في مكان واحد. حسيت إن UniLink عامل زي دليل يساعدني أخد قرار الجامعة بشكل أذكى',
    'Student, Thanaweya Amma',
    'طالب، الثانوية العامة',
    4,
    true,
    now(),
    now()
  );
