"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative w-full md:w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search"
        aria-label="Search notes"
        className="w-full rounded-xl border-transparent bg-muted/60 pl-9 ring-0 focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  )
}
