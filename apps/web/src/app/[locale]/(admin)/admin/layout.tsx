import { notFound, redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastProvider } from "@/components/admin/toast";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes";
import { getAdminActor } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// Every page under here reads live counts and rows that a colleague may have
// changed a second ago. A cached admin table is a wrong admin table.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  // This check is NOT the gate — it cannot be. Next.js skips a layout whose
  // segment the incoming router state already matches, so on every
  // sidebar-to-sidebar navigation only the page below re-renders. Each page
  // therefore calls requireAdminPage() itself; this runs on the first request
  // so the shell is never built for someone who should not see it.
  //
  // Three outcomes, deliberately distinct:
  //
  //   anonymous       -> the login page, with a callback back to here. The
  //                      proxy already does this on the cookie; this catches an
  //                      expired or forged one.
  //   signed in, not
  //   an admin        -> 404. Not a "forbidden" page: nothing in the product
  //                      links a student here, so confirming the route exists
  //                      only tells someone where to start guessing.
  //   admin           -> render.
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
  }

  // Re-read the role from the database rather than trusting session.user.role,
  // which is refreshed at most once a minute (see the jwt callback in
  // src/auth.ts). Revoking someone's access should log them out of the back
  // office on their next click, not a minute later.
  const actor = await getAdminActor();
  if (!actor) {
    notFound();
  }

  // The number on the Approvals link: everything waiting for a reviewer or,
  // for a university admin, their own changes still waiting.
  const pendingCount = await prisma.changeRequest.count({
    where: { status: "PENDING", ...(actor.level === 1 ? { authorId: actor.id } : {}) },
  });

  return (
    <ToastProvider>
      <UnsavedChangesProvider>
        <AdminShell
          user={{ name: actor.name, email: actor.email, image: actor.image, role: actor.role }}
          level={actor.level}
          pendingCount={pendingCount}
        >
          {children}
        </AdminShell>
      </UnsavedChangesProvider>
    </ToastProvider>
  );
}
