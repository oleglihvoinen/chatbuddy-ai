import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  ts: { type: Date, default: Date.now }
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String },
  model: { type: String, default: process.env.DEFAULT_MODEL || 'llama3' },
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);
