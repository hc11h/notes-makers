// app/page.tsx
"use client"

import { useMemo, useState } from "react"
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { NoteForm } from "@/components/note-form"
import { useNotes } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import DraggableNoteCard from "@/components/DraggableNoteCard"

export default function Page() {
  const { notes, addNote, updateNote, removeNote, toggleFavorite, reorderNotes } = useNotes()
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
    // favorites first, then by custom order
    return [...bySearch].sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
      return a.order - b.order
    })
  }, [notes, query])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex !== destinationIndex) {
      reorderNotes(sourceIndex, destinationIndex)
    }
  }

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

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="notes" direction="horizontal">
              {(provided) => (
                <section
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}
                >
                  {filtered.map((note, index) => (
                    <DraggableNoteCard
                      key={note.id} // Use note.id instead of index for stable keys
                      note={note}
                      index={index}
                      onFavorite={() => toggleFavorite(note.id)}
                      onEdit={() => onEdit(note.id)}
                      onDelete={() => removeNote(note.id)}
                    />
                  ))}
                  {provided.placeholder}
                </section>
              )}
            </Droppable>
          </DragDropContext>
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