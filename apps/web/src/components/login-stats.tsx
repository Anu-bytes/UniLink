"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { useStartedOnVisible } from "@/hooks/use-started-on-visible";

function LoginStatCard({
  value,
  label,
  started,
}: {
  value: number;
  label: string;
  started: boolean;
}) {
  const current = useCountUp(value, started);
  return (
    <div className="rounded-xl bg-white/10 p-3 text-center">
      <dt className="text-lg font-bold tabular-nums">
        +{Math.round(current).toLocaleString("en-US")}
      </dt>
      <dd className="mt-0.5 text-[11px] leading-tight text-white/70">
        {label}
      </dd>
    </div>
  );
}

export function LoginStats({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  const { ref, started } = useStartedOnVisible<HTMLDListElement>();

  return (
    <dl ref={ref} className="relative mt-10 grid grid-cols-3 gap-3">
      {values.map((value, i) => (
        <LoginStatCard
          key={labels[i] ?? i}
          value={value}
          label={labels[i] ?? ""}
          started={started}
        />
      ))}
    </dl>
  );
}
