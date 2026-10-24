import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: { type: String, default: '', maxlength: 200 },
  bio: { type: String, default: '', maxlength: 2000 },
  skills: [{ type: String, trim: true }],
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  portfolioProjects: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    link: { type: String, default: '' },
    github: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  isPortfolioPublic: { type: Boolean, default: true },
  availableForHire: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentProfileSchema);
