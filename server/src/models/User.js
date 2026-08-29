import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String, default: '' },
  preferences: {
    theme: { type: String, default: 'dark' },
    defaultTone: { type: String, default: 'Professional' },
    aiModel: { type: String, default: 'gemini-1.5-flash' }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
