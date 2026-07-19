-- UniLink is scoped to universities inside Egypt, so the onboarding wizard no
-- longer asks students which countries they want to study in. Drop the column
-- that backed that step.
ALTER TABLE "StudentProfile" DROP COLUMN "destinations";
