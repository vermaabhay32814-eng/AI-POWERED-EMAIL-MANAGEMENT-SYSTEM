import mongoose from 'mongoose';

const emailActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emailId: { type: String },
  action: { 
    type: String, 
    enum: [
      'SUMMARY_GENERATED',
      'REPLY_GENERATED',
      'EMAIL_SENT',
      'EMAIL_ARCHIVED',
      'EMAIL_DELETED',
      'EMAIL_STARRED',
      'GMAIL_CONNECTED',
      'EXPLAIN_GENERATED',
      'ACTION_ITEMS_EXTRACTED',
      'CLASSIFIED'
    ],
    required: true
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export const EmailActivity = mongoose.model('EmailActivity', emailActivitySchema);
