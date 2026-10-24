import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
    default: () => `MINT-${uuidv4().split('-')[0].toUpperCase()}`,
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  issuedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'revoked'], default: 'active' },
  revokedAt: { type: Date, default: null },
  revokedReason: { type: String, default: '' },
  quizScore: { type: Number, default: 0 },
}, { timestamps: true });

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model('Certificate', certificateSchema);
