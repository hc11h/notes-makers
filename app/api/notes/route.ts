// app/api/notes/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'

export async function GET() {
  try {
    await dbConnect()
    const notes = await Note.find().sort({ favorite: -1, order: 1 })
    // Ensure all notes have an id field
    const notesWithIds = notes.map(note => ({
      ...note.toObject(),
      id: note._id.toString()
    }))
    return NextResponse.json(notesWithIds)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { title, content, favorite, color, order } = await request.json()
    
    const newNote = new Note({
      title,
      content,
      favorite: favorite || false,
      color,
      order: order || 0,
    })

    const savedNote = await newNote.save()
    // Ensure the new note has an id field
    const noteWithId = {
      ...savedNote.toObject(),
      id: savedNote._id.toString()
    }
    return NextResponse.json(noteWithId, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create note' }, { status: 400 })
  }
}