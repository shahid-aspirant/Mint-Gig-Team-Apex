import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'FreelanceProject', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverMessage: { type: String, required: true, maxlength: 3000 },
  relevantSkills: [{ type: String }],
  proposedBudget: { type: Number, required: true },
  estimatedDays: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  clientNote: { type: String, default: '' },
  decidedAt: { type: Date, default: null },
}, { timestamps: true });

proposalSchema.index({ project: 1, student: 1 }, { unique: true });

export default mongoose.model('Proposal', proposalSchema);
