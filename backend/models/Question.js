import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for faster queries and search
questionSchema.index({ subjectId: 1, createdAt: -1 });
questionSchema.index({ title: 'text', answer: 'text' });
questionSchema.index({ tags: 1 });
questionSchema.index({ difficulty: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
