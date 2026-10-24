import mongoose from 'mongoose';

const clientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, default: '' },
  companySize: { type: String, enum: ['1-10', '11-50', '51-200', '200+', ''], default: '' },
  industry: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 2000 },
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  totalProjectsPosted: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('ClientProfile', clientProfileSchema);
