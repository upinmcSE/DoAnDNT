import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import { BackButton, ItemNotify } from '../../components';
import { AuthContext } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import { getNotifications } from '../../service/noticeService';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const { showInfo } = useToast();

  // Hàm lấy danh sách thông báo từ server
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      console.log('Notifications:', response.data.data);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Cập nhật state khi thông báo được đánh dấu là đã đọc
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.notificationId === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Lấy danh sách thông báo khi vào màn hình
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Lắng nghe thông báo realtime từ Socket.IO
  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (newNotification) => {
        // fetchNotifications();
        console.log('New notification received:', newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
        showInfo(newNotification.content);
      });
    }

    return () => {
      if (socket) socket.off('newNotification');
    };
  }, [socket]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
      </View>
      <ScrollView style={styles.content}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ItemNotify
              key={notification._id}
              notificationId={notification._id}
              type={notification.type}
              content={notification.content}
              fromUser={notification.fromUser}
              postId={notification.postId}
              timestamp={notification.createdAt}
              read={notification.read}
              onMarkAsRead={markAsRead} // Truyền callback
              fetchNotifications={fetchNotifications}
            />
          ))
        ) : (
          <Text style={styles.noNotifications}>Chưa có thông báo nào</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  noNotifications: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});

export default Notification;