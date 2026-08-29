import mongoose from 'mongoose';

const aiHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emailId: { type: String },
  type: { 
    type: String, 
    enum: ['summarize', 'reply', 'classify', 'explain', 'action-items', 'rewrite', 'smart-search'],
    required: true
  },
  input: { type: String },
  output: { type: mongoose.Schema.Types.Mixed },
  tone: { type: String },
  model: { type: String, default: 'gemini-1.5-flash' },
  tokensUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const AIHistory = mongoose.model('AIHistory', aiHistorySchema);
