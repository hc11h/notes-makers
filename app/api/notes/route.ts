// app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'
import { requireUser } from '@/app/api/_auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user.userId) return user;

    const notes = await Note.find({ userId: user.userId }).sort({ favorite: -1, order: 1 });
    console.log(`Found ${notes.length} notes for userId: ${user.userId}`);
    
    const notesWithIds = notes.map(note => ({
      ...note.toObject(),
      id: note._id.toString()
    }));

    console.log('notesWithIds', notesWithIds);
    return NextResponse.json(notesWithIds);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch notes' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user.userId) return user;

   


    const body = await request.json();
    const { title, content, favorite, color, order } = body;
   const newNote = new Note({
  userId: user.userId, // <-- ensure this is set
  title,
  content,
  favorite: favorite || false,
  color,
  order: order || 0,
});


const savedNote = await newNote.save();

    const noteWithId = {
      ...savedNote.toObject(),
      id: savedNote._id.toString()
    };
    return NextResponse.json(noteWithId, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create note' }, { status: 400 });
  }
}