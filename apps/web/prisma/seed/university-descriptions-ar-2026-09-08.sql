-- Arabic translations of the 8 seeded universities' short descriptions.
-- Names and cities already had Arabic (set at seed time); descriptions did
-- not, so the Arabic site was silently falling back to English text for
-- them. Same facts as the English descriptions in
-- university-descriptions-2026-09-07.sql, translated, not reworded.

BEGIN;

UPDATE "University" SET "descriptionAr" = 'افتتحت جامعة بدر بالقاهرة أبوابها عام 2014 في مدينة بدر بأطراف القاهرة الشمالية الشرقية، وتضم مجموعة واسعة من الكليات تمتد من الهندسة والفنون التطبيقية إلى الطب وطب الأسنان.'
WHERE slug = 'badr-university-in-cairo';

UPDATE "University" SET "descriptionAr" = 'جاء التعليم العالي البريطاني إلى مدينة الشروق عام 2005 بموجب اتفاقية بين الحكومتين المصرية والبريطانية، ولا تزال شهادات الجامعة البريطانية في مصر معتمدة من جامعاتها الشريكة في المملكة المتحدة حتى اليوم.'
WHERE slug = 'british-university-in-egypt';

UPDATE "University" SET "descriptionAr" = 'تأسست جامعة المستقبل بمصر في القاهرة الجديدة بموجب قرار جمهوري صدر عام 2006، وبنت سمعتها على برامج الصيدلة وطب الأسنان والهندسة، إلى جانب برامج أحدث في الحاسبات وإدارة الأعمال.'
WHERE slug = 'future-university-in-egypt';

UPDATE "University" SET "descriptionAr" = 'تتمتع الجامعة الألمانية بالقاهرة بتميز نادر كونها أول جامعة ألمانية تُنشأ خارج ألمانيا، وقد افتُتحت في القاهرة الجديدة عام 2003 بالشراكة مع جامعتي أولم وشتوتغارت.'
WHERE slug = 'german-university-in-cairo-guc';

UPDATE "University" SET "descriptionAr" = 'تعمل جامعة مصر الدولية من مقرها عند الكيلو 28 على طريق القاهرة الإسماعيلية منذ عام 1996، وهي من أقدم الجامعات الخاصة في مصر، وتتميز ببرامج إدارة الأعمال والصيدلة والألسن التطبيقية.'
WHERE slug = 'misr-international-university-miu';

UPDATE "University" SET "descriptionAr" = 'قليل من الجامعات الخاصة في مصر يضاهي حجم جامعة مصر للعلوم والتكنولوجيا، فمنذ عام 1996 نمت لتصبح واحدة من أكبر الجامعات الخاصة، وتضم كليات الطب والهندسة والعلوم الصحية في حرمها بمدينة 6 أكتوبر.'
WHERE slug = 'misr-university-for-science-and-technology';

UPDATE "University" SET "descriptionAr" = 'تعمل جامعة النيل بنموذج مختلف عن قصد، فهي مؤسسة غير هادفة للربح تُعلي من شأن البحث العلمي، وتقع في مدينة الشيخ زايد، وتنظّم برامجها منذ عام 2006 في مدارس للعلوم التطبيقية بدلاً من نظام الكليات التقليدي.'
WHERE slug = 'nile-university';

UPDATE "University" SET "descriptionAr" = 'أول جامعة خاصة في مصر على الإطلاق، تأسست عام 1996 في مدينة 6 أكتوبر، وبنت جامعة 6 أكتوبر اسمها على كليات الطب وطب الأسنان والصيدلة.'
WHERE slug = 'october-6-university';

COMMIT;
