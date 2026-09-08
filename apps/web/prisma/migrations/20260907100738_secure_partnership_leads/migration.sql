-- Leads are accessed through authenticated Next.js server routes using Prisma,
-- not through the Supabase client Data API. Keep contact details server-only.
ALTER TABLE "PartnershipLead" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "PartnershipLead" FROM PUBLIC;

-- These roles exist on Supabase, but not necessarily in local PostgreSQL.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON TABLE "PartnershipLead" FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        REVOKE ALL ON TABLE "PartnershipLead" FROM authenticated;
    END IF;
END
$$;
