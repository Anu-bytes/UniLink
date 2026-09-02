import { CARD } from "./styles";

/**
 * The read-only sibling of the kit's FormSection: same card, same header
 * rhythm, no form semantics. A lead is a submission to read, not a record to
 * edit, so its screen is three of these and not a single input.
 */
export function Panel({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={CARD}>
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
        {description ? (
          <p className="mt-1 text-[13px] text-[#64748B]">{description}</p>
        ) : null}
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
