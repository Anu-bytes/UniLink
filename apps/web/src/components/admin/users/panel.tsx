import { CARD } from "./styles";

/**
 * The read-only sibling of the kit's FormSection: same card, same header
 * rhythm, but with a slot for a link in the header and no form semantics. The
 * detail screen is three of these and not a single input.
 */
export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={CARD}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
          {description ? (
            <p className="mt-1 text-[13px] text-[#64748B]">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

/** One label/value pair inside a `<dl>`. */
export function FieldRow({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-slate-100 py-2.5 first:pt-0 last:border-b-0 last:pb-0">
      <dt className="text-[13px] text-[#64748B]">{label}</dt>
      <dd className="min-w-0 text-end text-[13.5px] text-[#334155]">{children}</dd>
    </div>
  );
}

/** The placeholder every empty column falls back to, so they all read alike. */
export function NotSet({ label }: { label: string }) {
  return <span className="text-slate-400">{label}</span>;
}
