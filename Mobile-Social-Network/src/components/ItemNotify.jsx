import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { readNotification } from '../service/noticeService';
import { useSocket } from '../context/SocketContext';

const ItemNotify = ({ type, content, postId, timestamp, read, notificationId, onMarkAsRead, fetchNotifications }) => {
  const navigation = useNavigation();
  const { fetchUnreadNotifications } = useSocket();

  const handlePress = async () => {
    try {
      // Gọi API để đánh dấu thông báo là đã đọc
      if (!read) {
        console.log('Marking notification as read:', notificationId);
        await readNotification(notificationId);
        onMarkAsRead(notificationId);
        fetchUnreadNotifications();
      }

      if( type === 'post_notice') {
        await readNotification(notificationId);
        onMarkAsRead(notificationId);
        navigation.navigate("CommentScreen", {
          postId: postId,
        });
      }

      if(type === 'comment_notice') {
        await readNotification(notificationId);
        onMarkAsRead(notificationId);
        navigation.navigate("CommentScreen", {
          postId: postId,
        });
      }

      if(type === 'reply_notice') {
        await readNotification(notificationId);
        onMarkAsRead(notificationId);
        navigation.navigate("CommentScreen", {
          postId: postId,
        });
      }

      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: read ? '#FFF' : '#F0F8FF' }]}
      onPress={handlePress}
    >
      <Image
        source={require('../assets/images/opps.png')}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.text}>{content}</Text>
        <Text style={styles.timestamp}>
          {new Date(timestamp).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default ItemNotify;