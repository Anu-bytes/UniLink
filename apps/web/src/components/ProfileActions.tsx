"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { Button } from "./ui/Button";
import { cn } from "@/lib/cn";

export function ProfileActions() {
  const { m } = useIntl();
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setSaved((s) => !s)}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-[10px] border px-4 text-sm font-medium",
          saved ? "border-accent bg-accent/10 text-accent" : "border-line bg-surface text-ink hover:bg-brand-50",
        )}
      >
        <Heart className={cn("size-4", saved && "fill-accent")} />
        {saved ? m.common.saved : m.common.save}
      </button>
      <Button variant="primary" disabled title={m.common.comingSoon}>
        {m.common.apply} · {m.common.comingSoon}
      </Button>
    </div>
  );
}
