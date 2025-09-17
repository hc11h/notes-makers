// app/api/notes/[id]/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await the params promise
    await dbConnect()
    const note = await Note.findById(id)
    
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 })
    }
    
    // Ensure the note has an id field
    const noteWithId = {
      ...note.toObject(),
      id: note._id.toString()
    }
    return NextResponse.json(noteWithId)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch note' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await the params promise
    await dbConnect()
    const { title, content, favorite, color, order } = await request.json()
    
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, favorite, color, order },
      { new: true }
    )
    
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 })
    }
    
    // Ensure the updated note has an id field
    const noteWithId = {
      ...updatedNote.toObject(),
      id: updatedNote._id.toString()
    }
    return NextResponse.json(noteWithId)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update note' }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await the params promise
    await dbConnect()
    const deletedNote = await Note.findByIdAndDelete(id)
    
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Note deleted' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 })
  }
}