import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { SOCKET_URL } from '../../env';
import { unreadNotification } from '../service/noticeService';
import { getUnreadMessagesCount } from '../service/chatService';

const SocketContext = createContext();



export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  const { user } = useContext(AuthContext);

  const [numberNotification, setNumberNotification] = useState(0);
  const [numberMessages, setNumberMessages] = useState(0);

  // Sử dụng useCallback để tránh tạo lại hàm mỗi khi render
  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const response = await unreadNotification();
      setNumberNotification(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy số thông báo chưa đọc:', error);
    }
  }, []);

  const fetchUnreadMessages = useCallback(async () => {
    try {
      const response = await getUnreadMessagesCount();
      setNumberMessages(response.data.count);
    } catch (error) {
      console.error('Lỗi khi lấy số tin nhắn chưa đọc:', error);
    }
  }, []);

  // Thiết lập socket và xử lý các sự kiện
  useEffect(() => {
    if (!user) {
      // Nếu không có user (chưa đăng nhập), không khởi tạo socket
      setSocket(null);
      return;
    }

    // Khởi tạo kết nối Socket.IO
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'], // Sử dụng WebSocket cho React Native
    });
    setSocket(newSocket);

    // Khi kết nối thành công, gửi userId và lấy dữ liệu ban đầu
    newSocket.on('connect', async () => {
      console.log('Đã kết nối với server');
      newSocket.emit('userOnline', user._id);
      await fetchUnreadNotifications();
      await fetchUnreadMessages();
    });

    // Lắng nghe thông báo mới
    newSocket.on('newNotification', (notification) => {
      if (!notification.read) {
        setNumberNotification((prev) => prev + 1); // Tăng số thông báo chưa đọc
      }
    });

    // Lắng nghe tin nhắn mới
    newSocket.on('newMessage', (message) => {
      if (!message.read) {
        setNumberMessages((prev) => prev + 1); // Tăng số tin nhắn chưa đọc
      }
    });

    // Xử lý khi mất kết nối
    newSocket.on('disconnect', () => {
      console.log('Mất kết nối với server');
    });

    // Cleanup khi component unmount hoặc user thay đổi
    return () => {
      newSocket.off('connect');
      newSocket.off('newNotification');
      newSocket.off('newMessage');
      newSocket.off('disconnect');
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user, fetchUnreadNotifications, fetchUnreadMessages]); // Thêm các phụ thuộc cần thiết

  // Cung cấp socket, unreadCount và numberMessages cho các component con
  const value = {
    socket,
    numberNotification,
    numberMessages,
    setNumberNotification,
    setNumberMessages,
    fetchUnreadMessages,
    fetchUnreadNotifications,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};