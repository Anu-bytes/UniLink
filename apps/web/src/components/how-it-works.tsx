import {
  Scale,
  Search,
  Send,
  SlidersHorizontal,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

const icons: LucideIcon[] = [UserPlus, SlidersHorizontal, Search, Scale, Send];

// A distinct accent per step keeps the flow colorful without extra clutter.
const accents = ["#1E6DEB", "#17A398", "#F0852E", "#A945D6", "#F5245F"];

export function HowItWorks({
  title,
  steps,
}: {
  title: string;
  steps: string[];
}) {
  return (
    <section className="bg-[#EEF4FE]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="text-center text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight text-[#16233F]">
          {title}
        </h2>

        <ol className="mt-12 flex flex-col items-stretch gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          {steps.map((step, i) => {
            const Icon = icons[i] ?? UserPlus;
            const color = accents[i] ?? "#1E6DEB";
            const isLast = i === steps.length - 1;
            return (
              <li
                key={step}
                style={
                  {
                    "--accent": color,
                    // Opaque light tint (not an alpha) so the dashed connector
                    // line never shows through the circle behind it.
                    "--accent-soft": `color-mix(in srgb, ${color} 12%, white)`,
                  } as React.CSSProperties
                }
                className="group relative flex flex-1 flex-col items-center text-center"
              >
                {/* dashed connector to the next step (horizontal, sm+) */}
                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute top-8 hidden h-px w-full translate-x-1/2 border-t-2 border-dashed border-[#C5D6F5] sm:block rtl:-translate-x-1/2"
                  />
                ) : null}

                <div className="relative z-10 cursor-default">
                  <span className="flex size-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm ring-1 ring-[var(--accent-soft)] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:shadow-lg">
                    <Icon
                      className="size-7 transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="absolute -end-1 -top-1 flex size-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white shadow ring-2 ring-[#EEF4FE]">
                    {i + 1}
                  </span>
                </div>

                <p className="mt-4 max-w-[10rem] text-sm font-semibold leading-6 text-[#2D3748] transition-colors group-hover:text-[var(--accent)] md:text-[15px]">
                  {step}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
