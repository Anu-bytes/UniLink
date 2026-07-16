import { Badge } from "@/components/ui/badge";

const rows = [
  { title: "MSc Data Science", school: "University of Toronto", match: "97%" },
  { title: "BSc Computer Science", school: "University of Manchester", match: "94%" },
  { title: "MBA", school: "Monash University", match: "91%" },
] as const;

export function ProgramMockup() {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-xl">
      <div className="flex items-center gap-1.5 pb-3">
        <span className="size-2.5 rounded-full bg-brand-red/50" />
        <span className="size-2.5 rounded-full bg-brand-blue-light" />
        <span className="size-2.5 rounded-full bg-muted" />
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.title}
            className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                {row.title}
              </p>
              <p className="text-xs text-muted-foreground">{row.school}</p>
            </div>
            <Badge variant="secondary">{row.match}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
