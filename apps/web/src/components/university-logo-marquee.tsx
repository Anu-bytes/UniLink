import { UniversityLogoTile } from "@/components/university-logo-tile";
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
    // No visible heading: the strip speaks for itself. The title stays as the
    // section's accessible name for screen readers.
    <section aria-label={title} className="relative border-y border-slate-100 bg-white py-6 md:py-8">
      <div
        dir="ltr"
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <ul className="ul-marquee flex w-max items-center gap-4 [animation-duration:70s] group-hover:[animation-play-state:paused] md:gap-6">
          {track.map((university, index) => {
            const clone = index >= withLogos.length;
            return (
              <li key={`${university.slug}-${clone ? "b" : "a"}`} aria-hidden={clone || undefined}>
                <UniversityLogoTile
                  href={`/universities/${university.slug}`}
                  logoUrl={university.logoUrl ?? ""}
                  name={university.name}
                  label={viewLabel(university.name)}
                  hidden={clone}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
