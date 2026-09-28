import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "full",
  href = "/",
  className,
}: {
  variant?: "full" | "mark";
  /** Where the mark links to. Defaults to the marketing homepage; the app
   * shell overrides this to `/app/search` since "home" inside the app is
   * search, not the marketing site. */
  href?: string;
  className?: string;
}) {
  const isFull = variant === "full";

  return (
    <Link
      href={href}
      className={cn("flex items-center", isFull && "logo-full-link", className)}
      aria-label="UniLink"
    >
      {isFull ? (
        // Wrapped so the dot overlay below can sit at a fixed % position
        // over the image no matter what height a caller renders it at
        // ([&_img]:h-* overrides elsewhere) — this span hugs the <img>
        // exactly, unlike the Link above it, which can be taller.
        <span className="relative inline-block">
          <Image
            src="/logo/unilink-logo-full-v3.png"
            alt="UniLink"
            width={451}
            height={134}
            className="h-12 w-auto"
            priority
          />
          {/* Stands in for the wordmark's own dot over the "i" (erased from
              the PNG itself) so it can hop on hover without a static
              duplicate left showing through mid-animation — see the
              .logo-full-link:hover rule in globals.css. */}
          <span
            aria-hidden
            className="ul-logo-dot absolute rounded-full bg-[#F82C1F]"
            style={{ left: "54.5%", top: "20%", width: "3.6%", height: "12%" }}
          />

          {/* The U mark's two red "slashes", same pieces (and same clip
              shapes) the splash screen flies apart on load — erased from
              this PNG too and stood in for here, so hovering the header
              logo gives them a small one-shot version of that same pop
              instead of a static image. Sized off the splash's own
              198:230 mark aspect ratio, not a freehand guess, so the
              background-position math already tuned for that box (see
              .ul-logo-slash below) lines up. */}
          <span
            className="absolute"
            style={{ left: "1.77%", top: "5.22%", width: "22.72%", height: "88.81%" }}
          >
            <span aria-hidden className="ul-logo-slash ul-splash-piece-1" />
            <span aria-hidden className="ul-logo-slash ul-splash-piece-2" />
          </span>
        </span>
      ) : (
        <Image
          src="/logo/unilink-logo-mark-v2.png"
          alt="UniLink"
          width={112}
          height={130}
          className="h-11 w-auto object-contain"
          priority
        />
      )}
    </Link>
  );
}
