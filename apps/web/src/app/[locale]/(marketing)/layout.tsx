export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The shared locale layout already owns the global navigation and footer.
  return children;
}
