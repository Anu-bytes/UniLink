import { cn } from "@/lib/utils";
import { initialsAvatar } from "@/lib/format";

/**
 * Round university mark. Falls back to a deterministic initials badge when no
 * logo has been uploaded, so cards and tables never show a broken image.
 */
export function UniversityLogo({
  name,
  logoUrl,
  className,
  textClassName,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
  textClassName?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logos come from
      // arbitrary partner hosts, which next/image would need whitelisted.
      <img
        src={logoUrl}
        alt=""
        className={cn(
          "size-10 shrink-0 rounded-full border border-slate-200 bg-white object-contain p-1",
          className,
        )}
      />
    );
  }

  const { initials, background, color } = initialsAvatar(name);

  return (
    <span
      aria-hidden
      style={{ background, color }}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full border border-white/70 font-bold",
        textClassName ?? "text-sm",
        className,
      )}
    >
      {initials}
    </span>
  );
}
