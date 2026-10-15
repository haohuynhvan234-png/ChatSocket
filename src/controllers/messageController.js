import * as messageService from '../services/messageService.js';

export const getByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;
    const messages = await messageService.getMessagesByRoom(room, limit);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { room, sender, senderName, content } = req.body;
    if (!sender || !content) {
      return res.status(400).json({ error: 'sender và content là bắt buộc' });
    }
    const message = await messageService.saveMessage({
      room: room || 'general',
      sender,
      senderName: senderName || 'Anonymous',
      content
    });
    res.status(201).json({ message: 'Tin nhắn đã được lưu', data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const message = await messageService.deleteMessage(req.params.id);
    if (!message) return res.status(404).json({ message: 'Không tìm thấy tin nhắn' });
    res.status(200).json({ message: 'Đã xóa tin nhắn thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
