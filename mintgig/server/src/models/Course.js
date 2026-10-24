import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // minutes
  order: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
});

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, default: 'Course Assessment' },
  description: { type: String, default: '' },
  questions: [quizQuestionSchema],
  passingScore: { type: Number, default: 70 }, // percentage
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, required: true, maxlength: 300 },
  description: { type: String, default: '' },
  instructor: { type: String, required: true },
  category: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Business', 'DevOps', 'AI/ML', 'Cybersecurity', 'Other'],
    required: true,
  },
  skillTags: [{ type: String, trim: true }],
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: { type: Number, default: 0 }, // hours
  price: { type: Number, default: 0 }, // INR, 0 = free
  thumbnail: { type: String, default: '' },
  learningObjectives: [{ type: String }],
  prerequisites: [{ type: String }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  lessons: [lessonSchema],
  quiz: quizSchema,
  certificateEligible: { type: Boolean, default: true },
  completionThreshold: { type: Number, default: 80 }, // % lessons needed
  enrollmentCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

courseSchema.index({ title: 'text', shortDescription: 'text', skillTags: 'text' });

export default mongoose.model('Course', courseSchema);
