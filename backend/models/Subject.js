import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subject title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
subjectSchema.index({ createdBy: 1, createdAt: -1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
