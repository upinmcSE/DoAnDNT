import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { Post } from "../../components";
import { BackButton } from "../../components";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../context/AuthContext";
import { getUser, followUser, unfollowUser } from "../../service/userService";
import { getPostsByUserId } from "../../service/postService";
import { useToast } from "../../context/ToastContext";
import { createConversation } from "../../service/chatService";


const User = ({ route }) => {
  const navigation = useNavigation();
  const { userId } = route.params;
  const { user, fetchMyUserData } = useContext(AuthContext);

  const [userData, setUserData] = useState(null); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); 

  const { showError, showSuccess, showInfo } = useToast();

  // Hàm lấy thông tin người dùng
  const fetchUserData = async () => {
    try {
      console.log("userId", userId);
      const response = await getUser(userId);
      const result = response.data;
      
      setUserData(result.data);
      
    } catch (error) {
      showError("Lỗi khi gọi API người dùng:", error.response?.data || error.message);
    }
  };

  // Kiểm tra xem có đang theo dõi không
  const checkFollowing = () => {
    if (userData && user) {
      return userData.followers.includes(user._id);
    }
    return false;
  }

  // Hàm lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      const response = await getPostsByUserId(userId);
      const result = response.data;
      setPosts(result.data);
      
    } catch (error) {
      showError("Lỗi tải bài viết:", error.response?.data || error.message);
    }
  };

  // Gọi cả hai API khi màn hình được mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchPosts()]);
      setLoading(false);
    };
    loadData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const response = await followUser(userId);
      const result = response.data;
      if (result.success) {
        showSuccess("Theo dõi thành công");
        fetchUserData();
        fetchMyUserData();
      } else {
        showError("Theo dõi thất bại")
      }
    } catch (error) {
      showError("Theo dõi thất bại: ", error.response?.data || error.message);
    }
  }

  const handleUnfollow = async () => {
    try {
      const response = await unfollowUser(userId);
      const result = response.data;
      if (result.success) {
        showSuccess("Bỏ theo dõi thành công");
        fetchUserData();
        fetchMyUserData();
      } else {
        showError("Bỏ theo dõi thất bại")
      }
    } catch (error) {
      showError("Bỏ theo dõi thất bại: ", error.response?.data || error.message);
    }
  }

  // Hiển thị Alert khi nhấn "Bỏ theo dõi"
  const handleUnfollowPress = () => {
    Alert.alert(
      "Xác nhận", // Tiêu đề
      "Bạn có chắc muốn bỏ theo dõi người này không?", // Thông báo
      [
        {
          text: "Hủy",
          style: "cancel", // Nút hủy, không làm gì
          onPress: () => console.log("Hủy bỏ theo dõi"),
        },
        {
          text: "Xác nhận",
          style: "destructive", // Nút xác nhận, màu đỏ để nhấn mạnh
          onPress: handleUnfollow, // Gọi API khi xác nhận
        },
      ],
      { cancelable: true } // Cho phép người dùng nhấn ngoài để hủy
    );
  }

  const handleCreateConversation = async () => {
    try {
      const response = await createConversation(userId);
      const result = response.data;
      navigation.navigate('Chat', {
        screen: 'MessageChat',
        params: { 
          conversationId: result._id,
          userData: userData,
        },
      });
      
    } catch (error) {
      showError("Tạo phòng chat thất bại:", error.response?.data || error.message);
    }

  }

  if (loading) {
    return <Text style={styles.loadingText}>Đang tải...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ position: "absolute", top: 20, zIndex: 10 }}>
          <BackButton color="white" />
        </View>

        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/anhnen.png")}
            style={styles.backgroundImage}
          />

          <View style={styles.profileCard}>
            <View style={styles.profileDetails}>
              <View style={styles.profileHeader}>
                <Image
                  source={
                    userData?.avtUrl
                      ? { uri: userData.avtUrl }
                      : require("../../assets/images/opps.png")
                  }
                  style={styles.profileImage}
                />

                <View style={styles.buttonContainer}>
                  {!checkFollowing() ? 
                    <TouchableOpacity 
                      style={styles.editButton1}
                      onPress={() => handleFollow()}
                    >
                      <Text style={styles.editButtonText}>Theo dõi</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity 
                      style={styles.editButton2}
                      onPress={handleUnfollowPress} // Sử dụng Alert thay vì Modal
                    >
                      <Text style={styles.editButtonText}>Bỏ theo dõi</Text>
                    </TouchableOpacity>
                  }

                  <TouchableOpacity
                    style={styles.chat}
                    onPress={handleCreateConversation}
                  >
                    <Icon name="mail" size={30} color="#ffffff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.Ellipsis}>
                    <Icon name="ellipsis-vertical" size={25} color="#1AE4A6" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{posts.length}</Text>
                  <Text style={styles.statLabel}>Pods</Text>
                </View>
                <TouchableOpacity
                  style={styles.statItem}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statNumber}>
                    {userData?.following?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statItem}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statNumber}>
                    {userData?.followers?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.name}>{userData?.name || "Sam Smith"}</Text>
                <Text style={styles.username}>
                  @{userData?.email?.split("@")[0] || "JohnD"}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 16, color: "#777" }}>
                  <Text style={styles.bioLabel}>Bio:</Text>
                  {userData?.bio || "..."}
                </Text>

                <View style={styles.locationContainer}>
                  <Icon name="location" size={20} color="#009EFD" />
                  <Text style={styles.location}>New York</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {posts.map((post) => (
            <View key={post._id} style={styles.post}>
              <Post
                name={post.userId.name}
                userId={post.userId._id}
                postId={post._id}
                content={post.content}
                liked={post.likes.length > 0}
                avt={post.userId.avtUrl ? { uri: post.userId.avtUrl } : require('../../assets/images/opps.png')}
                images={post.imageUrls}
                numLikes={post.likes.length}
                numCmts={post.comments.length}
                time={post.createdAt}
              />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  profileSection: {
    position: "relative",
    marginBottom: 20,
  },
  backgroundImage: {
    width: "100%",
    height: 280,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    marginTop: 120,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 15,
    zIndex: 2,
    position: "relative",
    elevation: 3,
    shadowOffset: { width: 0, height: -3 },
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    marginLeft: 15,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  Ellipsis: {
    left: 10,
  },
  chat: {
    backgroundColor: "#1AE4A6",
    borderRadius: 20,
    padding: 5,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "white",
    marginTop: -50,
  },
  profileDetails: {
    paddingHorizontal: 15,
  },
  profileInfo: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  editButton1: {
    borderColor: "#1AE4A6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#1AE4A6",
    elevation: 3,
  },
  editButton2: {
    borderColor: "#1AE4A6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fe0000",
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    marginLeft: 5,
    color: "white",
    fontStyle: "Roboto",
    fontWeight: "bold",
  },
  bioLabel: {
    color: "#3B82F6",
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  location: {
    fontSize: 14,
    color: "#777",
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    right: "15%",
    paddingVertical: 20,
  },
  statItem: {
    alignItems: "center",
    marginHorizontal: -50,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1AE4A6",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
  },
  post: {
    marginVertical: 15,
  },
  content: {
    paddingHorizontal: 15,
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default User;