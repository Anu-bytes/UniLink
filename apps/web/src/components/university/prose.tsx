import { Info } from "lucide-react";

/**
 * Renders stored copy. Blank lines start a new paragraph; single line breaks
 * become bullets, which is how the seed stores document checklists.
 */
export function Paragraphs({ text }: { text: string }) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length > 1) {
          return (
            <ul key={index} className="space-y-3">
              {lines.map((line, lineIndex) => (
                <li
                  key={lineIndex}
                  className="flex gap-3 text-base leading-8 text-[#5a6072]"
                >
                  <span
                    aria-hidden
                    className="mt-3 size-1.5 shrink-0 rounded-full bg-[#1E6DEB]"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-base leading-8 text-[#5a6072]">
            {lines[0]}
          </p>
        );
      })}
    </div>
  );
}

export function EmptySection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#F5F8FF] px-6 py-14 text-center">
      <Info className="size-6 text-[#1E6DEB]" aria-hidden />
      <p className="text-base text-[#5a6072]">{message}</p>
    </div>
  );
}

/** Heading + optional intro used at the top of the data-table tabs. */
export function SectionHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">{title}</h2>
      {intro ? (
        <p className="mt-2 text-base leading-7 text-[#5a6072]">{intro}</p>
      ) : null}
    </div>
  );
}
