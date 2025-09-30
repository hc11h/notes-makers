// app/api/notes/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'

import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 401 })
    }
    const notes = await Note.find({ userId }).sort({ favorite: -1, order: 1 })
    const notesWithIds = notes.map(note => ({
      ...note.toObject(),
      id: note._id.toString()
    }))
    return NextResponse.json(notesWithIds)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { userId, title, content, favorite, color, order } = body
    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 401 })
    }
    const newNote = new Note({
      userId,
      title,
      content,
      favorite: favorite || false,
      color,
      order: order || 0,
    })
    const savedNote = await newNote.save()
    const noteWithId = {
      ...savedNote.toObject(),
      id: savedNote._id.toString()
    }
    return NextResponse.json(noteWithId, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create note' }, { status: 400 })
  }
}