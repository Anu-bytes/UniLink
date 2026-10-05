import { Link } from "@/i18n/navigation";
import type { UniversitySearchEntry } from "@/lib/catalog";

/**
 * An endlessly scrolling strip of university logos under the homepage hero,
 * each one linking to that university's profile. It is the catalogue (the
 * universities you can explore here), not a "partners" or "trusted by"
 * claim. Pure CSS marquee: the list is rendered twice and the track slides
 * exactly half its width, so the loop is seamless; it pauses on hover and
 * under prefers-reduced-motion. Forced LTR so the slide direction and the
 * duplicated half line up in Arabic too.
 */
export function UniversityLogoMarquee({
  universities,
  title,
  viewLabel,
}: {
  universities: UniversitySearchEntry[];
  title: string;
  viewLabel: (name: string) => string;
}) {
  const withLogos = universities.filter((university) => university.logoUrl);
  if (withLogos.length < 6) return null;
  const track = [...withLogos, ...withLogos];

  return (
    <section className="relative border-y border-slate-100 bg-white py-7 md:py-9">
      <p className="mx-auto max-w-7xl px-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#98A0B4] md:px-6">
        {title}
      </p>
      <div
        dir="ltr"
        className="group relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <ul className="ul-marquee flex w-max items-center gap-4 [animation-duration:70s] group-hover:[animation-play-state:paused] md:gap-6">
          {track.map((university, index) => {
            const clone = index >= withLogos.length;
            return (
              <li key={`${university.slug}-${clone ? "b" : "a"}`} aria-hidden={clone || undefined}>
                <Link
                  href={`/universities/${university.slug}`}
                  tabIndex={clone ? -1 : undefined}
                  aria-label={viewLabel(university.name)}
                  title={university.name}
                  className="flex h-16 w-32 items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 shadow-[0_6px_18px_-12px_rgba(15,23,42,0.3)] grayscale-[0.85] opacity-70 transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/30 hover:opacity-100 hover:shadow-[0_16px_30px_-16px_rgba(30,109,235,0.5)] hover:grayscale-0 md:h-20 md:w-40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- small local logos, already optimized */}
                  <img
                    src={university.logoUrl ?? ""}
                    alt=""
                    loading="lazy"
                    className="max-h-10 max-w-full object-contain md:max-h-12"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
