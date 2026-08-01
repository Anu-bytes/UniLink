import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "full",
  className,
}: {
  variant?: "full" | "mark";
  className?: string;
}) {
  const isFull = variant === "full";

  return (
    <Link
      href="/"
      className={cn("flex items-center", className)}
      aria-label="UniLink"
    >
      <Image
        src={
          isFull
            ? "/logo/unilink-logo-full-v2.png"
            : "/logo/unilink-logo-mark-v2.png"
        }
        alt="UniLink"
        width={isFull ? 451 : 112}
        height={isFull ? 134 : 130}
        className={isFull ? "h-12 w-auto" : "h-11 w-auto object-contain"}
        priority
      />
    </Link>
  );
}
