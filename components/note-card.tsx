"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Pencil, Trash2 } from "lucide-react"
import type { Note } from "@/hooks/use-notes"

const colorPool = [
  "bg-sky-100 text-slate-900",
  "bg-amber-100 text-slate-900",
  "bg-emerald-100 text-slate-900",
]

export default function NoteCard({
  note,
  onFavorite,
  onEdit,
  onDelete,
}: {
  note: Note
  onFavorite: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const colorMap = {
    sky: "bg-sky-50 text-slate-900 border-sky-200",
    amber: "bg-amber-50 text-slate-900 border-amber-200",
    emerald: "bg-emerald-50 text-slate-900 border-emerald-200",
    purple: "bg-purple-50 text-slate-900 border-purple-200",
    violet: "bg-violet-50 text-slate-900 border-violet-200",
    indigo: "bg-indigo-50 text-slate-900 border-indigo-200",
    teal: "bg-teal-50 text-slate-900 border-teal-200",
    cyan: "bg-cyan-50 text-slate-900 border-cyan-200",
    lime: "bg-lime-50 text-slate-900 border-lime-200",
    blue: "bg-blue-50 text-slate-900 border-blue-200",
    red: "bg-red-50 text-slate-900 border-red-200",
    pink: "bg-pink-50 text-slate-900 border-pink-200",
    fuchsia: "bg-fuchsia-50 text-slate-900 border-fuchsia-200",
  } as const
  
  const color = colorMap[note.color]
  const date = new Date(note.date)

  return (
    <Card className={cn("overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5", color)}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-pretty text-lg font-semibold leading-snug tracking-tight">{note.title || "Untitled"}</h3>
          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              aria-pressed={note.favorite}
              aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
              onClick={onFavorite}
              className={cn("size-8 rounded-full text-slate-700 hover:bg-black/5", note.favorite && "text-red-500")}
              title={note.favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("size-4", note.favorite && "fill-current")} />
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