
import { Server } from 'socket.io'; // Import đúng cách

let io;
let onlineUsers = new Map(); // Lưu danh sách user online

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Khi user đăng nhập/đăng ký online
    socket.on('userOnline', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online. Total online: ${onlineUsers.size}`);
      io.emit('onlineUsersUpdate', Array.from(onlineUsers.keys())); // Cập nhật danh sách user online cho tất cả client
    });

    // Khi user disconnect
    socket.on('disconnect', () => {
      for (let [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected. Total online: ${onlineUsers.size}`);
          io.emit('onlineUsersUpdate', Array.from(onlineUsers.keys())); // Cập nhật lại danh sách
          break;
        }
      }
    });

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.id} left conversation ${conversationId}`);
    });
  });

  return io; // Trả về instance của io
};

// Hàm để phát sự kiện newPost
const emitNewPost = (postData) => {
  if (io) {
    io.emit('newPost', postData); // Phát sự kiện đến tất cả client
  }
};

// Gửi thông báo đến một user cụ thể
const emitNotification = (userId, notification) => {
  console.log('Emitting notification:', notification);
  const socketId = onlineUsers.get(userId);
  if (socketId && io) {
    io.to(socketId).emit('newNotification', notification);
  }
};


const emitMessage = (userId, message) => {
  console.log('Emitting message:', message);
  const socketId = onlineUsers.get(userId);
  if (socketId && io) {
    io.to(socketId).emit('newMessage', message);
  }
};

// Đánh dấu tin nhắn là đã đọc
const emitMarkMessageAsRead = (conversationId, messageId) => {
  if (io) {
    io.to(conversationId).emit('messageRead', {
      messageId,
      isRead: true
    });
    console.log(`Emitted messageRead for message ${messageId} in conversation ${conversationId}`);
  }
};


export default {
  initSocket,
  emitNewPost,
  emitNotification,
  emitMessage,
  emitMarkMessageAsRead,
  getOnlineUsers: () => Array.from(onlineUsers.keys()), // Hàm để lấy danh sách user online
};