import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function VerifiedBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600",
        className,
      )}
      title={label}
    >
      <BadgeCheck className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
