"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function PasswordRequirements({
  password,
  labels,
}: {
  password: string
  labels: {
    minLength: string
    lowercase: string
    uppercase: string
    number: string
  }
}) {
  const rules = [
    { key: "minLength", met: password.length >= 10, label: labels.minLength },
    { key: "lowercase", met: /[a-z]/.test(password), label: labels.lowercase },
    { key: "uppercase", met: /[A-Z]/.test(password), label: labels.uppercase },
    { key: "number", met: /[0-9]/.test(password), label: labels.number },
  ]

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
      {rules.map((rule) => (
        <li
          key={rule.key}
          className={cn(
            "flex items-center gap-1.5 text-xs",
            rule.met ? "text-brand-blue" : "text-muted-foreground"
          )}
        >
          <Check className={cn("size-3.5 shrink-0", !rule.met && "opacity-30")} />
          {rule.label}
        </li>
      ))}
    </ul>
  )
}
