// models/Note.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    required: true,
    enum: ['sky', 'amber', 'emerald', 'purple', 'violet', 'indigo', 'teal', 'cyan', 'lime', 'blue', 'red', 'pink', 'fuchsia'],
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

export default Note;