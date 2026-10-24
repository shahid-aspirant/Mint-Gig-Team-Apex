import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 5000 },
  readAt: { type: Date, default: null },
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'FreelanceProject', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  lastMessageAt: { type: Date, default: Date.now },
  lastMessage: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
