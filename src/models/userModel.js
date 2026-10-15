import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar' },
    isOnline: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
