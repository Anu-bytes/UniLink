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
        src={isFull ? "/logo/unilink-logo-full.png" : "/logo/unilink-logo-mark.png"}
        alt="UniLink"
        width={isFull ? 466 : 229}
        height={isFull ? 149 : 259}
        className={isFull ? "h-12 w-auto" : "h-11 w-auto object-contain"}
        priority
      />
    </Link>
  );
}
