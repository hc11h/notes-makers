"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"

import { NoteForm } from "@/components/note-form"
import { useNotes } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import NoteCard from "@/components/note-card"

export default function Page() {
  const { notes, addNote, updateNote, removeNote, togglePin } = useNotes()
  const [query, setQuery] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingNote = useMemo(
    () => (editingId ? (notes.find((n) => n.id === editingId) ?? null) : null),
    [notes, editingId],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const bySearch = q.length
      ? notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      : notes
    // pinned first, newest first inside groups
    return [...bySearch].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [notes, query])

  const onCreate = () => {
    setEditingId(null)
    setFormOpen(true)
  }

  const onEdit = (id: string) => {
    setEditingId(id)
    setFormOpen(true)
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex">
        <Sidebar onAdd={onCreate} />
        <main className="mx-auto flex-1 p-4 md:max-w-6xl md:p-8">
          <header className="mb-4 md:mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">Notes</h1>
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </header>

          <section aria-label="Notes Grid" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={() => togglePin(note.id)}
                onEdit={() => onEdit(note.id)}
                onDelete={() => removeNote(note.id)}
              />
            ))}
          </section>
        </main>
      </div>

      {/* Mobile floating add button */}
      <div className="fixed bottom-5 right-5 md:hidden">
        <Button
          aria-label="Add note"
          onClick={onCreate}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <NoteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onAdd={addNote}
        onUpdate={updateNote}
        editingId={editingId}
        editingNote={editingNote}
      />
    </div>
  )
}
