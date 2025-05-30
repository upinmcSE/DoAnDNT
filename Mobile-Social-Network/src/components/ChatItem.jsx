import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { formatTime } from '../utils/timeUtils';

const ChatItem = ({ name, message, date, avatar, onPress, isViewed }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <Image
        source={avatar ? { uri: avatar } : require('../assets/images/opps.png')}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.messageDateContainer}>
          <Text
            style={[styles.message, isViewed ? { color: 'black', fontSize: 16 } : { color: 'gray-500' }]}
          >
            {message}
          </Text>
          <Text style={styles.date}>   {formatTime(date)}</Text>
        </View>
      </View>

      <View style={styles.badgeContainer}>
        {isViewed && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  messageDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  message: {
    fontSize: 12, // Kích thước chữ tin nhắn đã được giảm
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  badgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#1E88E5', // Màu nền của badge
    borderRadius: 10, // Bo tròn để phù hợp với số
    width: 15, // Kích thước badge
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff', // Màu chữ trắng
    fontSize: 10, // Kích thước chữ của số
    fontWeight: 'bold',
  },
  smallAvatar: {
    width: 15,
    height: 15,
    borderRadius: 10,
  },
});

export default ChatItem;