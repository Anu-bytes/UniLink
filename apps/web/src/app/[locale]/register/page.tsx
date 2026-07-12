import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterWizard } from "@/components/auth/RegisterWizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return { title: getMessages((await params).locale).auth.registerTitle };
}

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterWizard />
    </AuthShell>
  );
}
