import type { ReactNode } from "react"

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-500">
      {index} / {children}
    </p>
  )
}
