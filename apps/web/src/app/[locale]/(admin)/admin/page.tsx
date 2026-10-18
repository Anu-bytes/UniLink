import { requireAdminPage } from "@/lib/admin";
import { ReviewerHome } from "@/components/admin/home/reviewer-home";
import { SuperAdminHome } from "@/components/admin/home/super-admin-home";
import { UniversityAdminHome } from "@/components/admin/home/university-admin-home";

export default async function AdminOverviewPage() {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  // Every admin level lands here, each on its own home.
  const actor = await requireAdminPage({ minLevel: 1 });
  if (actor.level === 1) return <UniversityAdminHome actor={actor} />;
  if (actor.level === 2) return <ReviewerHome actor={actor} />;
  return <SuperAdminHome actor={actor} />;
}
