import React, { useState, useEffect, useContext } from 'react'; // Sửa useContext để đảm bảo import đúng
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import apiClient from '../service/apiClient';
import { AuthContext } from '../context/AuthContext'; 
import { followUser, unfollowUser } from '../service/userService'; 

const UserProfileCard = ({ userId, flag }) => {
  const [isFollowing, setIsFollowing] = useState(false); // Mặc định là false, sẽ kiểm tra sau
  const [userData, setUserData] = useState({});
  const { user, fetchMyUserData } = useContext(AuthContext); // Lấy thông tin user từ context

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy thông tin user từ API
        const response = await apiClient.get(`/user/userId/${userId}`);
        setUserData(response.data.data || {});

        // Kiểm tra xem userId có trong mảng following của user hiện tại không
        if (user && user.following && user.following.includes(userId)) {
          setIsFollowing(true); // Nếu có, đặt isFollowing là true
        } else {
          setIsFollowing(false); // Nếu không, đặt isFollowing là false
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, user]); // Thêm user vào dependency array để re-fetch khi user thay đổi

  const handleUnFollowToggle = async () => {
    setIsFollowing(!isFollowing);
    if (isFollowing) {
      await unfollowUser(userId);
      fetchMyUserData();
    }
  }
  
  
  const handleFollowToggle = async () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      await followUser(userId);
      fetchMyUserData();

    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={userData.avtUrl ? 
          { uri: userData.avtUrl } 
          : require('../assets/images/opps.png')
        }
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{userData.name || 'Người dùng'}</Text>
          </View>
          {flag === 'following' ? (
            <TouchableOpacity
              style={[styles.button, styles.unfollowButton]}
              onPress={handleUnFollowToggle}
            >
              <Text style={styles.buttonText}>Bỏ theo dõi</Text>
            </TouchableOpacity>
          ) : flag === 'follower' && !isFollowing ? ( // Chỉ hiển thị nút "Theo dõi" nếu chưa follow
            <TouchableOpacity
              style={[styles.button, styles.followButton]}
              onPress={handleFollowToggle}
            >
              <Text style={styles.buttonText}>Theo dõi</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '95%',
    height: 100,
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A73E8',
  },
  username: {
    color: 'gray',
    fontSize: 14,
  },
  bio: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
  },
  button: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  unfollowButton: {
    backgroundColor: '#FE2C55', // Màu đỏ cho nút "Bỏ theo dõi"
  },
  followButton: {
    backgroundColor: '#1A73E8', // Màu xanh cho nút "Theo dõi"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default UserProfileCard;