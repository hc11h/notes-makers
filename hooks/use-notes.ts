// hooks/use-notes.ts
"use client"

import { useEffect, useState } from "react"

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
  order: number
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes')
        if (!response.ok) throw new Error('Failed to fetch notes')
        const data = await response.json()
        // Ensure all notes have IDs
        const notesWithIds = data.map((note: any) => ({
          ...note,
          id: note.id || note._id?.toString() || `temp-${Date.now()}`
        }))
        setNotes(notesWithIds)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const addNote = async (partial: Omit<Note, "id">) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial)
      })
      
      if (!response.ok) throw new Error('Failed to add note')
      const newNote = await response.json()
      // Ensure the new note has an ID
      const noteWithId = {
        ...newNote,
        id: newNote.id || newNote._id?.toString() || `temp-${Date.now()}`
      }
      setNotes(prev => [noteWithId, ...prev])
      return noteWithId
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateNote = async (id: string, patch: Partial<Note>) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      })
      
      if (!response.ok) throw new Error('Failed to update note')
      const updatedNote = await response.json()
      // Ensure the updated note has an ID
      const noteWithId = {
        ...updatedNote,
        id: updatedNote.id || updatedNote._id?.toString() || id
      }
      setNotes(prev => prev.map(note => note.id === id ? noteWithId : note))
      return noteWithId
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const removeNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete note')
      setNotes(prev => prev.filter(note => note.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const note = notes.find(n => n.id === id)
      if (!note) return
      
      const updatedNote = await updateNote(id, { favorite: !note.favorite })
      return updatedNote
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const reorderNotes = async (sourceIndex: number, destinationIndex: number) => {
    try {
      // Create a new array with the reordered notes
      const newNotes = Array.from(notes)
      const [removed] = newNotes.splice(sourceIndex, 1)
      newNotes.splice(destinationIndex, 0, removed)
      
      // Update the order property for each note
      const updatedNotes = newNotes.map((note, index) => ({
        ...note,
        order: index
      }))
      
      // Update the backend with the new order
      const response = await fetch('/api/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      })
      
      if (!response.ok) throw new Error('Failed to reorder notes')
      
      // Update local state
      setNotes(updatedNotes)
      return updatedNotes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return { 
    notes, 
    loading, 
    error, 
    addNote, 
    updateNote, 
    removeNote, 
    toggleFavorite, 
    reorderNotes 
  }
}