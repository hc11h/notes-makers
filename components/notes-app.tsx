"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useNotes, type Note } from "@/hooks/useNotes"
import NoteCard from "@/components/note-card"

export default function NotesApp() {
  const { notes, addNote, updateNote, removeNote, toggleFavorite } = useNotes() // Removed togglePin

  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<Note> | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      : notes
    // favorite first, then by date (descending)
    return [...list].sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
      // Use date property instead of updatedAt
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [notes, query])

  function openCreate() {
    // Create a new note with all required properties
    setDraft({
      title: "",
      content: "",
      date: new Date().toISOString(),
      favorite: false, // Use favorite instead of pinned
      color: "sky" // Default white color
    })
    setIsOpen(true)
  }

  function openEdit(n: Note) {
    setDraft({ ...n })
    setIsOpen(true)
  }

  function handleSave() {
    if (!draft) return
    const title = (draft.title ?? "").trim()
    const content = (draft.content ?? "").trim()
    if (!title && !content) {
      setIsOpen(false)
      setDraft(null)
      return
    }
    if (draft.id) {
      updateNote(draft.id, { title, content })
    } else {
      // Ensure all required properties are present when creating a new note
      addNote({
        title,
        content,
        color:"sky",
        date: new Date().toISOString(),  // Add the current date
        favorite: false,   // Default to not favorited
        order: 0          // Default order (you might want to adjust this based on your app logic)
      })
    }
    setIsOpen(false)
    setDraft(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6 md:px-6">
      {/* Sidebar */}
      <aside className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-14 shrink-0 rounded-2xl bg-card p-3 shadow-sm md:block">
        <div className="flex h-full flex-col items-center justify-between">
          <div aria-hidden />
          <Button
            aria-label="Add note"
            className="size-10 rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90"
            onClick={openCreate}
          >
            <Plus className="size-5" />
          </Button>
        </div>
      </aside>

      {/* Main */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Top search */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">Notes</h1>
          <div className="flex flex-1 justify-end">
            <div className="w-full max-w-md">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="rounded-xl bg-muted/60"
                aria-label="Search notes"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onFavorite={() => toggleFavorite(note.id)}
              onEdit={() => openEdit(note)}
              onDelete={() => removeNote(note.id)}
            />
          ))}
        </div>

        {/* Mobile floating add */}
        <Button
          aria-label="Add note"
          className="fixed bottom-5 right-5 z-20 rounded-full bg-primary text-primary-foreground shadow md:hidden"
          onClick={openCreate}
        >
          <Plus className="mr-1 size-5" />
          New
        </Button>
      </section>

      {/* Create/Edit modal */}
      <Dialog
        open={isOpen}
        onOpenChange={(v) => {
          if (!v) setDraft(null)
          setIsOpen(v)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit Note" : "New Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={draft?.title ?? ""}
              onChange={(e) => setDraft((d) => ({ ...(d ?? {}), title: e.target.value }))}
              placeholder="Title"
              className="rounded-xl"
            />
            <Textarea
              value={draft?.content ?? ""}
              onChange={(e) => setDraft((d) => ({ ...(d ?? {}), content: e.target.value }))}
              placeholder="Write your note..."
              rows={6}
              className="rounded-xl"
            />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="secondary" className="rounded-xl">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSave} className="rounded-xl">
              {draft?.id ? "Save changes" : "Add note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}