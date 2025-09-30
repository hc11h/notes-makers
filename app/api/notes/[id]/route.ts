// app/api/notes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'


// GET a single note by id, only if it belongs to the user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 401 });
    }
    await dbConnect();
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    const noteWithId = {
      ...note.toObject(),
      id: note._id.toString(),
    };
    return NextResponse.json(noteWithId);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch note' }, { status: 500 });
  }
}


// UPDATE a note by id, only if it belongs to the user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 401 });
    }
    await dbConnect();
    const { title, content, favorite, color, order } = await request.json();
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content, favorite, color, order },
      { new: true }
    );
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    const noteWithId = {
      ...updatedNote.toObject(),
      id: updatedNote._id.toString(),
    };
    return NextResponse.json(noteWithId);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update note' }, { status: 400 });
  }
}


// DELETE a note by id, only if it belongs to the user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 401 });
    }
    await dbConnect();
    const deletedNote = await Note.findOneAndDelete({ _id: id, userId });
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 });
  }
}