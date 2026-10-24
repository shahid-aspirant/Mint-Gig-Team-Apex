import mongoose from 'mongoose';

const freelanceProjectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String, trim: true }],
  category: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Business', 'DevOps', 'AI/ML', 'Cybersecurity', 'Writing', 'Other'],
    required: true,
  },
  budgetType: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
  budgetMin: { type: Number, required: true },
  budgetMax: { type: Number, required: true },
  duration: { type: String, default: '' },
  deadline: { type: Date, default: null },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled', 'paused'],
    default: 'open',
  },
  proposalCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

freelanceProjectSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });

export default mongoose.model('FreelanceProject', freelanceProjectSchema);
