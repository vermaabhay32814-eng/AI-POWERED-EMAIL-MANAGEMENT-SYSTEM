import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messageId: { type: String, index: true },
  threadId: { type: String },
  from: {
    name: { type: String, default: '' },
    email: { type: String, required: true }
  },
  to: [
    {
      name: { type: String, default: '' },
      email: { type: String, required: true }
    }
  ],
  subject: { type: String, default: '(No Subject)' },
  snippet: { type: String, default: '' },
  body: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isTrash: { type: Boolean, default: false },
  folder: { type: String, enum: ['inbox', 'sent', 'drafts', 'trash', 'starred', 'archive'], default: 'inbox' },
  category: { 
    type: String, 
    enum: ['Work', 'Personal', 'Finance', 'Shopping', 'Education', 'Promotions', 'Spam', 'Important', 'General'],
    default: 'General'
  },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  summary: { type: String, default: '' },
  actionItems: [
    {
      task: { type: String },
      deadline: { type: String }
    }
  ],
  labels: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Email = mongoose.model('Email', emailSchema);
