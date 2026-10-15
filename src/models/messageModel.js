import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, default: 'general', index: true },
    sender: { type: String, required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
