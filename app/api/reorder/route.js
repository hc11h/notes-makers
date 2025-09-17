// app/api/reorder/route.js
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

export async function PUT(request) {
  try {
    await dbConnect();
    const { notes } = await request.json();
    
    // Update the order for each note
    const updatePromises = notes.map((note, index) =>
      Note.findByIdAndUpdate(note.id, { order: index })
    );

    await Promise.all(updatePromises);
    
    return new Response(JSON.stringify({ message: 'Notes reordered successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}