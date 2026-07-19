import { cn } from "@/lib/utils";

/**
 * Gray placeholder box that keeps the exact aspect ratio of the reference
 * image (width/height in px) while still shrinking on small screens.
 */
export function ImagePlaceholder({
  w,
  h,
  className,
  label,
  rounded = "rounded-2xl",
}: {
  w: number;
  h: number;
  className?: string;
  label?: string;
  rounded?: string;
}) {
  return (
    <div
      style={{ width: w, aspectRatio: `${w} / ${h}`, maxWidth: "100%" }}
      className={cn(
        "flex shrink-0 self-center items-center justify-center bg-slate-200 text-xs font-medium text-slate-400",
        rounded,
        className,
      )}
    >
      {label ?? `${w}×${h}`}
    </div>
  );
}
