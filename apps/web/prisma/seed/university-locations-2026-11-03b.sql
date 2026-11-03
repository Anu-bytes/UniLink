-- Campus points supplied by the UniLink team for the universities that had
-- none, so every published university appears on the "Find nearest" map.
-- Kayan University also gets its fuller address. University of Lancashire
-- Egypt and University of London Egypt share the European Universities in
-- Egypt campus, so they share a point.
UPDATE "University" SET "latitude" = 29.857713450938906, "longitude" = 30.90430899332533 WHERE "slug" = 'badya-university';
UPDATE "University" SET "latitude" = 30.138857792443357, "longitude" = 31.686904054709792 WHERE "slug" = 'city-university';
UPDATE "University" SET "latitude" = 29.972183356096327, "longitude" = 31.7099029792993 WHERE "slug" = 'coventry-university-egypt';
UPDATE "University" SET "latitude" = 31.039421817853203, "longitude" = 30.435213445786857 WHERE "slug" = 'damanhour-national-university';
UPDATE "University" SET "latitude" = 30.022446040681167, "longitude" = 31.708755056019168 WHERE "slug" = 'egyptian-informatics-university';
UPDATE "University" SET "latitude" = 31.09757745930666, "longitude" = 30.94938247672249 WHERE "slug" = 'kafr-el-sheikh-national-university';
UPDATE "University" SET "latitude" = 29.961401944590886, "longitude" = 31.596446714783017,
  "addressLine" = 'New Administrative Capital, Egypt (next to the Egyptian Military Academy and the Equestrian Club)',
  "addressLineAr" = 'العاصمة الإدارية الجديدة، مصر (بجوار الأكاديمية العسكرية المصرية ونادي الفروسية)'
  WHERE "slug" = 'kayan-university';
UPDATE "University" SET "latitude" = 29.843935401681325, "longitude" = 31.362209015533455 WHERE "slug" = 'may-university-in-cairo';
UPDATE "University" SET "latitude" = 29.976751041185583, "longitude" = 31.528399997031592 WHERE "slug" = 'memphis-university';
UPDATE "University" SET "latitude" = 25.79184521306466, "longitude" = 30.49093060693604 WHERE "slug" = 'new-valley-national-university';
UPDATE "University" SET "latitude" = 30.279189211886337, "longitude" = 31.470593018431416 WHERE "slug" = 'obour-university-of-science-and-technology';
UPDATE "University" SET "latitude" = 31.38639316366449, "longitude" = 30.347430287302746 WHERE "slug" = 'rashid-university';
UPDATE "University" SET "latitude" = 30.828314845285092, "longitude" = 30.997242734619057 WHERE "slug" = 'tanta-national-university';
UPDATE "University" SET "latitude" = 30.166579491222386, "longitude" = 31.53909930999509 WHERE "slug" = 'university-of-east-capital';
UPDATE "University" SET "latitude" = 30.06556084148107, "longitude" = 31.75015746941508 WHERE "slug" = 'university-of-lancashire-egypt';
UPDATE "University" SET "latitude" = 30.06556084148107, "longitude" = 31.75015746941508 WHERE "slug" = 'university-of-london-egypt';
