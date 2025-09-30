"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Note, NoteColor } from "@/hooks/useNotes"
import { cn } from "@/lib/utils"

const COLORS: { key: NoteColor; bg: string; ring: string }[] = [
  { key: "sky", bg: "bg-sky-500", ring: "ring-sky-300" },
  { key: "amber", bg: "bg-amber-500", ring: "ring-amber-300" },
  { key: "emerald", bg: "bg-emerald-500", ring: "ring-emerald-300" },
  { key: "purple", bg: "bg-purple-500", ring: "ring-purple-300" },
  { key: "violet", bg: "bg-violet-500", ring: "ring-violet-300" },
  { key: "indigo", bg: "bg-indigo-500", ring: "ring-indigo-300" },
  { key: "teal", bg: "bg-teal-500", ring: "ring-teal-300" },
  { key: "cyan", bg: "bg-cyan-500", ring: "ring-cyan-300" },
  { key: "lime", bg: "bg-lime-500", ring: "ring-lime-300" },
  { key: "blue", bg: "bg-blue-500", ring: "ring-blue-300" },
  { key: "red", bg: "bg-red-500", ring: "ring-red-300" },
  { key: "pink", bg: "bg-pink-500", ring: "ring-pink-300" },
  { key: "fuchsia", bg: "bg-fuchsia-500", ring: "ring-fuchsia-300" },
]

export function NoteForm({
  open,
  onOpenChange,
  editingId,
  onAdd,
  onUpdate,
  editingNote,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editingId: string | null
  onAdd: (partial: Omit<Note, "id">) => void
  onUpdate: (id: string, patch: Partial<Note>) => void
  editingNote: Note | null
}) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState<NoteColor>("sky")

  const isEditing = Boolean(editingId)

  useEffect(() => {
    if (!open) return
    if (isEditing && editingNote) {
      setTitle(editingNote.title || "")
      setContent(editingNote.content || "")
      setColor(editingNote.color || "sky")
    } else {
      setTitle("")
      setContent("")
      setColor("sky")
    }
  }, [open, isEditing, editingNote])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      onUpdate(editingId, { title, content, color })
    } else {
      onAdd({
        title,
        content,
        color,
        date: new Date().toISOString(),  // Add the current date
        favorite: false,   // Default to not favorited
        order: 0          // Default order (you might want to adjust this based on your app logic)
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit note" : "New note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="min-h-32"
            />
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-label={`Choose ${c.key} color`}
                  onClick={() => setColor(c.key)}
                  className={cn(
                    "h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-background",
                    c.bg,
                    color === c.key ? c.ring : "ring-transparent",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              {isEditing ? "Save changes" : "Add note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
