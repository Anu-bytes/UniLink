import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Cairo,
  IBM_Plex_Sans_Arabic,
  Inter,
  Open_Sans,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "../globals.css";
import "./globals.css";
import { isLocale, dir } from "@/i18n/config";
import { IntlProvider } from "@/i18n/provider";
import { SessionProvider } from "@/components/auth/session";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});
const plexAr = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-ar",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UniLink — Discover universities and programs",
    template: "%s · UniLink",
  },
  description:
    "Discover universities, compare programs, and build a personalized study plan in English or Arabic.",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = dir(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${jakarta.variable} ${openSans.variable} ${cairo.variable} ${plexAr.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-bg text-ink">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DirectionProvider direction={direction}>
            <IntlProvider locale={locale}>
              <SessionProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </SessionProvider>
            </IntlProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
