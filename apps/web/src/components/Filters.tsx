"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useIntl } from "@/i18n/provider";
import { FIELDS } from "@/data/fields";
import { FEE_BUCKETS } from "@/data/fee-buckets";
import { pick } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Bilingual } from "@/lib/types";

export interface CityOption {
  value: string;
  label: Bilingual;
}

export function Filters({ cities }: { cities: CityOption[] }) {
  const { locale, m } = useIntl();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function toggleMulti(key: string, value: string) {
    update((p) => {
      const values = p.getAll(key);
      p.delete(key);
      const set = new Set(values);
      set.has(value) ? set.delete(value) : set.add(value);
      set.forEach((v) => p.append(key, v));
    });
  }

  function setSingle(key: string, value: string | null) {
    update((p) => (value ? p.set(key, value) : p.delete(key)));
  }

  function clearAll() {
    update((p) => {
      ["field", "degree_type", "fee_bucket", "city", "national_intl", "min_fees", "max_fees"].forEach((k) =>
        p.delete(k),
      );
    });
  }

  const selField = new Set(params.getAll("field"));
  const selFee = new Set(params.getAll("fee_bucket"));
  const selCity = new Set(params.getAll("city"));
  const degree = params.get("degree_type") ?? "";
  const nat = params.get("national_intl") ?? "";

  const hasActive =
    selField.size || selFee.size || selCity.size || degree || nat || params.get("min_fees") || params.get("max_fees");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-head text-base font-semibold text-ink">{m.search.filters}</h2>
        {hasActive ? (
          <button onClick={clearAll} className="text-xs font-medium text-brand hover:underline">
            {m.common.clearAll}
          </button>
        ) : null}
      </div>

      {/* Field of Study */}
      <Section title={m.search.fieldOfStudy}>
        <div className="flex flex-col gap-1.5">
          {FIELDS.map((f) => (
            <Check
              key={f.id}
              checked={selField.has(f.id)}
              onChange={() => toggleMulti("field", f.id)}
              label={pick(f.name, locale)}
            />
          ))}
        </div>
      </Section>

      {/* Degree Type */}
      <Section title={m.search.degreeType}>
        <Segmented
          value={degree}
          onChange={(v) => setSingle("degree_type", v || null)}
          options={[
            { value: "", label: m.common.all },
            { value: "undergraduate", label: m.common.undergraduate },
            { value: "postgraduate", label: m.common.postgraduate },
          ]}
        />
      </Section>

      {/* Tuition Fees */}
      <Section title={m.search.tuitionFees}>
        <div className="flex flex-col gap-1.5">
          {FEE_BUCKETS.map((b) => (
            <Check
              key={b.id}
              checked={selFee.has(b.id)}
              onChange={() => toggleMulti("fee_bucket", b.id)}
              label={pick(b.label, locale)}
            />
          ))}
        </div>
      </Section>

      {/* Certification */}
      <Section title={m.search.certification}>
        <Segmented
          value={nat}
          onChange={(v) => setSingle("national_intl", v || null)}
          options={[
            { value: "", label: m.common.all },
            { value: "national", label: m.common.national },
            { value: "international", label: m.common.international },
          ]}
        />
      </Section>

      {/* Location */}
      <Section title={m.search.location}>
        <div className="flex flex-col gap-1.5">
          {cities.map((c) => (
            <Check
              key={c.value}
              checked={selCity.has(c.value)}
              onChange={() => toggleMulti("city", c.value)}
              label={pick(c.label, locale)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-line accent-brand"
      />
      {label}
    </label>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex rounded-[10px] border border-line p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            value === o.value ? "bg-brand text-white" : "text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
