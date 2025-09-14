"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusIcon as PushPin, Pencil, Trash2 } from "lucide-react"
import type { Note } from "@/hooks/use-notes"

const colorPool = [
  "bg-sky-100 text-slate-900", // primary tint
  "bg-amber-100 text-slate-900", // accent 1 tint
  "bg-emerald-100 text-slate-900", // accent 2 tint
]

export default function NoteCard({
  note,
  onPin,
  onEdit,
  onDelete,
}: {
  note: Note
  onPin: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const color = colorPool[note.colorIndex % colorPool.length]
  const date = new Date(note.createdAt)

  return (
    <Card className={cn("overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md", color)}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-pretty text-lg font-semibold leading-snug">{note.title || "Untitled"}</h3>
          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              aria-pressed={note.pinned}
              aria-label={note.pinned ? "Unpin note" : "Pin note"}
              onClick={onPin}
              className={cn("size-8 rounded-full text-slate-700 hover:bg-black/5", note.pinned && "text-black")}
              title={note.pinned ? "Unpin" : "Pin"}
            >
              <PushPin className={cn("size-4", note.pinned && "fill-current")} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Edit note"
              onClick={onEdit}
              className="size-8 rounded-full text-slate-700 hover:bg-black/5"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Delete note"
              onClick={onDelete}
              className="size-8 rounded-full text-slate-700 hover:bg-black/5"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        {note.content ? (
          <p className="text-pretty text-sm leading-relaxed">
            {note.content.length > 200 ? note.content.slice(0, 200) + "…" : note.content}
          </p>
        ) : (
          <p className="text-sm text-slate-600">No content</p>
        )}
        <div className="mt-4 text-xs text-slate-600">
          {date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </CardContent>
    </Card>
  )
}
