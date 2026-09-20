import { CompareProvider } from "@/components/app/compare-context";
import { CompareTray } from "@/components/app/compare-tray";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The compare selection lives in localStorage, so wrapping the public pages
  // in the same provider/tray as the app lets a program be added to compare
  // from a university profile and carry over to the app.
  return (
    <CompareProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <CompareTray />
    </CompareProvider>
  );
}
