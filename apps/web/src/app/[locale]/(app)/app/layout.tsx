import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { auth } from "@/auth";
import { AppShell } from "@/components/app/app-shell";
import { CompareProvider } from "@/components/app/compare-context";
import { CompareTray } from "@/components/app/compare-tray";
import { SavedProvider } from "@/components/app/saved-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();

  // The proxy already gates this path on the session cookie; this second check
  // covers an expired or forged cookie before any data is read.
  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/app`);
  }

  // A student or parent can reach here with no StudentProfile at all: signing
  // up with Google mid-wizard used to create the bare User (via the adapter)
  // and then land straight on the app with no profile ever collected, since
  // nothing forced them back through onboarding. PARTNER/ADMIN accounts never
  // get a StudentProfile in the first place, so they're excluded here.
  const [account, savedCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, studentProfile: { select: { id: true } } },
    }),
    prisma.savedFaculty.count({ where: { userId: session.user.id } }),
  ]);

  if (
    account &&
    (account.role === "STUDENT" || account.role === "PARENT") &&
    !account.studentProfile
  ) {
    redirect(`/${locale}/onboarding`);
  }

  return (
    <SavedProvider initialCount={savedCount}>
      <CompareProvider>
        <AppShell
          user={{
            name: session.user.name ?? null,
            email: session.user.email ?? null,
            image: session.user.image ?? null,
          }}
        >
          {children}
        </AppShell>
        <CompareTray />
      </CompareProvider>
    </SavedProvider>
  );
}
