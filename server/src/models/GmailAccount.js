import mongoose from 'mongoose';

const gmailAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  accessToken: { type: String },
  refreshToken: { type: String },
  tokenExpiry: { type: Date },
  isConnected: { type: Boolean, default: true },
  lastSyncedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const GmailAccount = mongoose.model('GmailAccount', gmailAccountSchema);
