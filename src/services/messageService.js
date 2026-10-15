import Message from '../models/messageModel.js';

export const saveMessage = async (data) => {
  return await Message.create(data);
};

export const getMessagesByRoom = async (room, limit = 50) => {
  return await Message.find({ room })
    .sort({ createdAt: 1 })
    .limit(limit);
};

export const deleteMessage = async (id) => {
  return await Message.findByIdAndDelete(id);
};
