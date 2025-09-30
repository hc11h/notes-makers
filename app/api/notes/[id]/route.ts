// app/api/notes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'


// GET a single note by id, only if it belongs to the user (by token)
import User from '@/models/User';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const note = await Note.findOne({ _id: id, userId: user.userId });
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


// UPDATE a note by id, only if it belongs to the user (by token)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { token, ...patch } = body;
    if (!token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: user.userId },
      patch,
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


// DELETE a note by id, only if it belongs to the user (by token)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const token = body.token || request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const deletedNote = await Note.findOneAndDelete({ _id: id, userId: user.userId });
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 });
  }
}