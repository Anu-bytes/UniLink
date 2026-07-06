import { cn } from "@/lib/cn";

export function Chip({
  active = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-surface text-ink hover:border-brand-200 hover:bg-brand-50",
        className,
      )}
      {...props}
    />
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
