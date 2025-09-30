"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
  | "fuchsia";

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string; // ISO
  favorite: boolean;
  color: NoteColor;
  order: number;
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes from the backend, using token from sessionStorage
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = sessionStorage.getItem("user_token");
        if (!token) throw new Error("No user token found");
        // Fetch notes for this user by token only
  const response = await axios.get(`/api/notes`, { headers: { Authorization: `Bearer ${token}` } });
        const data = response.data;
        const notesWithIds = data.map((note: any) => ({
          ...note,
          id: note.id || note._id?.toString() || `temp-${Date.now()}`
        }));
        setNotes(notesWithIds);
      } catch (err: any) {
        setError(err?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const addNote = async (partial: Omit<Note, "id">) => {
    try {
      const token = sessionStorage.getItem("user_token");
      if (!token) throw new Error("No user token found");
  const response = await axios.post("/api/notes", { ...partial }, { headers: { Authorization: `Bearer ${token}` } });
      const newNote = response.data;
      const noteWithId = {
        ...newNote,
        id: newNote.id || newNote._id?.toString() || `temp-${Date.now()}`
      };
      setNotes((prev) => [noteWithId, ...prev]);
      return noteWithId;
    } catch (err: any) {
      setError(err?.message || "Unknown error");
      throw err;
    }
  };

  const updateNote = async (id: string, patch: Partial<Note>) => {
    try {
      const token = sessionStorage.getItem("user_token");
      if (!token) throw new Error("No user token found");
  const response = await axios.put(`/api/notes/${id}`, { ...patch }, { headers: { Authorization: `Bearer ${token}` } });
      const updatedNote = response.data;
      const noteWithId = {
        ...updatedNote,
        id: updatedNote.id || updatedNote._id?.toString() || id
      };
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? noteWithId : note))
      );
      return noteWithId;
    } catch (err: any) {
      setError(err?.message || "Unknown error");
      throw err;
    }
  };

  const removeNote = async (id: string) => {
    try {
      const token = sessionStorage.getItem("user_token");
      if (!token) throw new Error("No user token found");
  await axios.delete(`/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err: any) {
      setError(err?.message || "Unknown error");
      throw err;
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const note = notes.find((n) => n.id === id);
      if (!note) return;

      const updatedNote = await updateNote(id, {
        favorite: !note.favorite
      });
      return updatedNote;
    } catch (err: any) {
      setError(err?.message || "Unknown error");
      throw err;
    }
  };

  const reorderNotes = async (sourceIndex: number, destinationIndex: number) => {
    try {
      const token = sessionStorage.getItem("user_token");
      if (!token) throw new Error("No user token found");
      const newNotes = Array.from(notes);
      const [removed] = newNotes.splice(sourceIndex, 1);
      newNotes.splice(destinationIndex, 0, removed);
      const updatedNotes = newNotes.map((note, index) => ({
        ...note,
        order: index
      }));
  await axios.put("/api/reorder", { notes: updatedNotes }, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(updatedNotes);
      return updatedNotes;
    } catch (err: any) {
      setError(err?.message || "Unknown error");
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    removeNote,
    toggleFavorite,
    reorderNotes
  };
}
