// ============================================================================
// SOCKET DEMO — Backend (Node.js + Socket.IO)
// ----------------------------------------------------------------------------
// Mục tiêu: cho intern HIỂU socket là gì trong ~5 phút, bằng code thật.
//
// Ý tưởng cốt lõi (đọc trước khi chạy):
//   HTTP (REST API)   = gửi request → nhận response → ĐÓNG kết nối.
//                       Giống như gọi điện hỏi 1 câu rồi cúp máy.
//                       Muốn biết có gì mới → phải gọi lại (polling).
//
//   Socket (WebSocket) = mở 1 ĐƯỜNG KẾT NỐI DUY TRÌ, giao tiếp 2 CHIỀU.
//                       Server có thể CHỦ ĐỘNG đẩy dữ liệu về client
//                       bất cứ lúc nào, không cần client hỏi trước.
//                       Giống như gọi điện thoại: đường dây luôn mở,
//                       bên nào cũng có thể nói bất cứ lúc nào.
//
// Chạy:  npm install && node server.js              (terminal 1, API :3001)
//        cd client && npm install && npm run dev   (terminal 2, FE :3000)
//        → mở http://localhost:3000 (mở 2 tab để thấy realtime)
// ============================================================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// ⚠️ Socket.IO phải "bám" vào HTTP server gốc, không phải app Express.
// http.createServer(app) tạo server HTTP; Socket.IO sẽ "nâng cấp"
// (upgrade/handshake) một số request HTTP thành kết nối WebSocket.
const server = http.createServer(app);
const io = new Server(server);

// Danh sách người đang online: socketId -> tên hiển thị
const onlineUsers = new Map();

// ────────────────────────────────────────────────────────────────────────────
// SỰ KIỆN QUAN TRỌNG NHẤT: "connection"
// Mỗi client (mỗi tab trình duyệt) kết nối tới → server tạo ra 1 object
// `socket` RIÊNG, đại diện cho "đường dây" tới đúng client đó.
// Từ đây, mọi giao tiếp đều qua các "event" (sự kiện có tên).
// ────────────────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`🟢 CONNECT    ${socket.id} — một client vừa mở đường dây`);

  // ── 1. Client "tham gia" kèm tên ──────────────────────────────────────────
  // socket.on('tên-event', callback)  = LẮNG NGHE event từ client này.
  socket.on("join", (name) => {
    onlineUsers.set(socket.id, name);
    console.log(`👤 ${name} (${socket.id}) đã join`);

    // socket.broadcast.emit(...) = gửi cho TẤT CẢ TRỪ chính mình.
    // (Không cần báo cho chính người vừa join rằng "bạn vừa join".)
    socket.broadcast.emit("user-joined", `${name} vừa tham gia phòng chat`);

    // io.emit(...) = gửi cho TẤT CẢ mọi người, kể cả mình.
    io.emit("online-list", [...onlineUsers.values()]);
  });

  // ── 2. Client gửi tin nhắn chat ────────────────────────────────────────────
  // socket.emit('chat-message', ...) ở client → rơi vào đúng handler này.
  socket.on("chat-message", (msg) => {
    const name = onlineUsers.get(socket.id) || "Ẩn danh";
    console.log(`💬 ${name}: ${msg}`);

    // Server nhận 1 message → PHÁT LẠI cho tất cả (kể cả người gửi,
    // để người gửi cũng thấy tin của mình hiện lên như mọi người).
    io.emit("chat-message", {
      name,
      msg,
      time: new Date().toLocaleTimeString("vi-VN"),
    });
  });

  // ── 3. "Đang gõ..." ──────────────────────────────────────────────────────
  // Chỉ báo cho NGƯỜI KHÁC (broadcast) — mình đang gõ thì mình tự biết rồi.
  socket.on("typing", () => {
    const name = onlineUsers.get(socket.id);
    if (name) socket.broadcast.emit("typing", name);
  });

  // ── 4. Client ngắt kết nối (tắt tab, mất mạng, F5...) ─────────────────────
  // "disconnect" TỰ ĐỘNG bắn — đây là thứ HTTP thuần KHÔNG làm được
  // một cách tự nhiên (server HTTP không biết client còn đó hay đã đi).
  // → Đây chính là lý do các tính năng "đang online", "đã xem",
  //    "đang gõ..." đều cần socket.
  socket.on("disconnect", () => {
    const name = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    console.log(`🔴 DISCONNECT ${socket.id} (${name || "chưa đặt tên"})`);
    if (name) {
      socket.broadcast.emit("user-left", `${name} đã rời phòng`);
      io.emit("online-list", [...onlineUsers.values()]);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// TÓM TẮT 3 CÁCH GỬI (intern hay nhầm nhất chỗ này):
//   socket.emit('e', data)            → gửi RIÊNG cho đúng client này
//   socket.broadcast.emit('e', data)  → gửi cho TẤT CẢ TRỪ client này
//   io.emit('e', data)                → gửi cho TẤT CẢ (kể cả client này)
// ────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Socket API chạy tại: http://localhost:${PORT}`);
  console.log(
    `   Mở FE: cd client && npm run dev → http://localhost:3000 (2 tab)\n`,
  );
});
