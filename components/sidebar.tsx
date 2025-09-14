"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function Sidebar({ onAdd }: { onAdd: () => void }) {
  return (
    <aside
      className="hidden h-dvh shrink-0 border-r border-sidebar-border bg-sidebar p-3 md:flex md:w-16 md:flex-col md:items-center md:pt-4"
      aria-label="Sidebar"
    >
      <Button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary p-0 text-primary-foreground shadow hover:bg-primary/90"
        aria-label="Add note"
        onClick={onAdd}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </aside>
  )
}
