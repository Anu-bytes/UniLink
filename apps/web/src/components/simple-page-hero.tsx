export function SimplePageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-brand-blue">{title}</h1>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
