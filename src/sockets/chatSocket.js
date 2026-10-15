import { saveMessage } from '../services/messageService.js';

export const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Client kết nối: ${socket.id}`);

    // Tham gia vào một phòng chat
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`👤 Client ${socket.id} đã vào phòng: ${room}`);
      socket.to(room).emit('notification', {
        message: `Một người dùng mới đã tham gia phòng ${room}`,
        timestamp: new Date()
      });
    });

    // Rời khỏi phòng chat
    socket.on('leave_room', (room) => {
      socket.leave(room);
      console.log(`👤 Client ${socket.id} đã rời phòng: ${room}`);
      socket.to(room).emit('notification', {
        message: `Một người dùng đã rời phòng ${room}`,
        timestamp: new Date()
      });
    });

    // Gửi và nhận tin nhắn theo thời gian thực
    socket.on('send_message', async (data) => {
      try {
        const { room = 'general', sender, senderName, content } = data;

        if (!content || !sender) {
          return socket.emit('error_message', { error: 'Nội dung và người gửi không được để trống' });
        }

        // Lưu tin nhắn vào MongoDB
        const savedMessage = await saveMessage({
          room,
          sender,
          senderName: senderName || 'Anonymous',
          content
        });

        // Phát tin nhắn đến tất cả thành viên trong phòng (bao gồm cả người gửi)
        io.to(room).emit('receive_message', savedMessage);
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn qua socket:', error.message);
        socket.emit('error_message', { error: 'Không thể gửi tin nhắn' });
      }
    });

    // Bắt sự kiện đang gõ phím (typing indicator)
    socket.on('typing', ({ room, userName }) => {
      socket.to(room).emit('user_typing', { userName });
    });

    socket.on('stop_typing', ({ room, userName }) => {
      socket.to(room).emit('user_stop_typing', { userName });
    });

    // Ngắt kết nối
    socket.on('disconnect', () => {
      console.log(`❌ Client đã ngắt kết nối: ${socket.id}`);
    });
  });
};
