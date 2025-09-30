import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'
import { requireUser } from '@/app/api/_auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await requireUser(request);
    if (!user.userId) return user;

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
    console.error("GET note error:", error);
    return NextResponse.json({ message: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await requireUser(request);
    if (!user.userId) return user;

    const patch = await request.json();

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
    console.error("PUT note error:", error);
    return NextResponse.json({ message: 'Failed to update note' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await requireUser(request);
    if (!user.userId) return user;

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId: user.userId });

    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error("DELETE note error:", error);
    return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 });
  }
}