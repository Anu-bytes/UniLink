import { GraduationCap, Globe2 } from "lucide-react";

const avatars = [
  { initials: "AM", className: "bg-brand-blue-dark" },
  { initials: "PS", className: "bg-brand-red" },
  { initials: "DR", className: "bg-white/20" },
  { initials: "KT", className: "bg-white/20" },
  { initials: "JL", className: "bg-brand-red" },
  { initials: "NB", className: "bg-brand-blue-dark" },
] as const;

export function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-blue to-brand-blue-dark" />
      <div className="absolute inset-6 grid grid-cols-3 gap-3 rounded-[2rem]">
        {avatars.map((avatar) => (
          <div
            key={avatar.initials}
            className={`flex items-center justify-center rounded-2xl text-lg font-semibold text-white ${avatar.className}`}
          >
            {avatar.initials}
          </div>
        ))}
      </div>

      <div className="absolute -start-4 top-8 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-foreground shadow-lg">
        <GraduationCap className="size-4 text-brand-blue" />
        Offer received
      </div>
      <div className="absolute -end-4 bottom-10 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-foreground shadow-lg">
        <Globe2 className="size-4 text-brand-red" />
        6 destinations
      </div>
    </div>
  );
}
