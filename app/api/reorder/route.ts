import { NextRequest } from "next/server";
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

type NoteOrder = { id: string; order?: number };

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { notes }: { notes: NoteOrder[] } = await request.json();
    // Update the order for each note
    const updatePromises = notes.map((note: NoteOrder, index: number) =>
      Note.findByIdAndUpdate(note.id, { order: index })
    );
    await Promise.all(updatePromises);
    return new Response(JSON.stringify({ message: 'Notes reordered successfully' }), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}