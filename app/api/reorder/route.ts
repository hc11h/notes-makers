import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import { requireUser } from "@/app/api/_auth";

type NoteOrder = {
  id: string;
  order: number;
};

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const { notes }: { notes: NoteOrder[] } = await request.json();

    const user = await requireUser(request);
    if (!user.userId) return user; // Unauthorized response from requireUser

    // Validate input
    if (!Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json({ message: "No notes to reorder" }, { status: 400 });
    }

    // Map update promises ensuring the note belongs to the user
    const updatePromises = notes.map((note, index) =>
      Note.findOneAndUpdate(
        { _id: note.id, userId: user.userId },
        { order: index },
        { new: true } // return the updated document
      )
    );

    const updatedNotes = await Promise.all(updatePromises);

    // Check if any update failed (i.e., no note found or user mismatch)
    const failedUpdates = updatedNotes.filter(note => note === null);
    if (failedUpdates.length > 0) {
      return NextResponse.json(
        { message: "Some notes could not be updated. Make sure notes belong to the user." },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: "Notes reordered successfully" }, { status: 200 });

  } catch (error) {
    console.error("PUT /api/notes reorder error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
