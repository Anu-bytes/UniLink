-- Staging schema for the catalogue restore: empty copies of the catalogue
-- tables (same column types, defaults and unique indexes, no foreign keys),
-- so the catalogue can be rebuilt and checked before it goes into "public".
DROP SCHEMA IF EXISTS restore_stage CASCADE;
CREATE SCHEMA restore_stage;
CREATE TABLE restore_stage."University" (LIKE public."University" INCLUDING ALL);
CREATE TABLE restore_stage."Faculty" (LIKE public."Faculty" INCLUDING ALL);
CREATE TABLE restore_stage."Program" (LIKE public."Program" INCLUDING ALL);
CREATE TABLE restore_stage."ProgramIntake" (LIKE public."ProgramIntake" INCLUDING ALL);
CREATE TABLE restore_stage."ProgramEnglishRequirement" (LIKE public."ProgramEnglishRequirement" INCLUDING ALL);
CREATE TABLE restore_stage."MinimumScore" (LIKE public."MinimumScore" INCLUDING ALL);
CREATE TABLE restore_stage."UniversityImage" (LIKE public."UniversityImage" INCLUDING ALL);
CREATE TABLE restore_stage."UniversityFeature" (LIKE public."UniversityFeature" INCLUDING ALL);
CREATE TABLE restore_stage."UniversityContentBlock" (LIKE public."UniversityContentBlock" INCLUDING ALL);
CREATE TABLE restore_stage."Scholarship" (LIKE public."Scholarship" INCLUDING ALL);
CREATE TABLE restore_stage."Testimonial" (LIKE public."Testimonial" INCLUDING ALL);
