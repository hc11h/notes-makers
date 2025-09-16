// hooks/use-notes.ts
"use client"

import { useEffect, useState } from "react"
import { nanoid } from "nanoid"

export type NoteColor =
  | "sky"
  | "amber"
  | "emerald"
  | "purple"
  | "violet"
  | "indigo"
  | "teal"
  | "cyan"
  | "lime"
  | "blue"
  | "red"
  | "pink"
  | "fuchsia"

export type Note = {
  id: string
  title: string
  content: string
  date: string // ISO
  favorite: boolean
  color: NoteColor
  order: number // Add order property for custom sorting
}

const STORAGE_KEY = "notes-v1"

// Seed a few example notes on first run to match the reference layout
const seedNotes: Note[] = [
  {
    id: "seed-1",
    title: "The beginning of screenless design",
    content: "UI jobs to be taken over by Solution Architect. Exploring how voice and ambient UX reshape flows.",
    date: "2020-05-21T00:00:00.000Z",
    favorite: false,
    color: "amber",
    order: 0,
  },
  {
    id: "seed-2",
    title: "52 Research Terms you need to know as a UX Designer",
    content: "From heuristic evaluation to triangulation—short glossary for product folks.",
    date: "2020-05-23T00:00:00.000Z",
    favorite: true,
    color: "sky",
    order: 1,
  },
  {
    id: "seed-3",
    title: "UI & UX Lessons from Designing My Own Product",
    content: "Notes on tradeoffs, prob discovery and scope with tiny teams shipping fast.",
    date: "2020-06-01T00:00:00.000Z",
    favorite: false,
    color: "emerald",
    order: 2,
  },
]

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  // Load from localStorage once
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        setNotes(seedNotes)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNotes))
      } else {
        const parsedNotes = JSON.parse(raw)
        // Ensure all notes have an order property
        const notesWithOrder = parsedNotes.map((note: Note, index: number) => ({
          ...note,
          order: note.order ?? index,
        }))
        setNotes(notesWithOrder)
      }
    } catch {
      setNotes(seedNotes)
    }
  }, [])

  // Save on change
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {
      // ignore write errors
    }
  }, [notes])

  const addNote = (partial: Omit<Note, "id">) => {
    const newNote = {
      ...partial,
      order: notes.length, // Add to the end
    }
    setNotes((prev) => [{ id: nanoid(), ...newNote }, ...prev])
  }

  const updateNote = (id: string, patch: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const toggleFavorite = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)))
  }

  const reorderNotes = (startIndex: number, endIndex: number) => {
    setNotes((prevNotes) => {
      const result = Array.from(prevNotes)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      
      // Update order property for all notes
      return result.map((note, index) => ({
        ...note,
        order: index,
      }))
    })
  }

  return { notes, addNote, updateNote, removeNote, toggleFavorite, reorderNotes }
}