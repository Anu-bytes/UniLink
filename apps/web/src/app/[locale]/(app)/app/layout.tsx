import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { auth } from "@/auth";
import { AppShell } from "@/components/app/app-shell";
import { CompareProvider } from "@/components/app/compare-context";
import { CompareTray } from "@/components/app/compare-tray";
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

  const savedCount = await prisma.savedProgram.count({
    where: { userId: session.user.id },
  });

  return (
    <CompareProvider>
      <AppShell
        user={{
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        }}
        savedCount={savedCount}
      >
        {children}
      </AppShell>
      <CompareTray />
    </CompareProvider>
  );
}
