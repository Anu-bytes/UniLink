import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Plus_Jakarta_Sans, Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { isLocale, dir } from "@/i18n/config";
import { IntlProvider } from "@/i18n/provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-cairo", display: "swap" });
const plexAr = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--font-plex-ar", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "UniLink — Discover universities in Egypt",
    template: "%s · UniLink",
  },
  description:
    "Discover and compare universities and programs across Egypt — bilingual search, filters, and a live map.",
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

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${inter.variable} ${jakarta.variable} ${cairo.variable} ${plexAr.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-bg text-ink">
        <IntlProvider locale={locale}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </IntlProvider>
      </body>
    </html>
  );
}
