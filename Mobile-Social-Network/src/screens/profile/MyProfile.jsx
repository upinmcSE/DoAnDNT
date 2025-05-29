import React, { useContext } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { Post } from "../../components";
import { BackButton } from "../../components";
import { useNavigation } from "@react-navigation/native"; 
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from '../../context/ToastContext';
import { getPostsByUserId } from "../../service/postService";
import PostList from "../../components/PostList";
import { getLikes } from "../../service/postService";
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesList, setLikesList] = useState([]);

  const { showError, showSuccess, showInfo } = useToast();

  const fetchPosts = async () => {
      try {
        const response = await getPostsByUserId(user._id);
        const result = response.data;
        if (result.success) {
          setPosts(result.data);
        } else {
          showError("Không thể lấy bài viết của người dùng");
        }
      } catch (error) {
        showError("Không thể lấy bài viết của người dùng");
      }
  };

  const fetchLikes = async (postId) => {
    try {
      const response = await getLikes(postId);
      const result = response.data;
      if (result.success) {
        setLikesList(result.data);
      } else {
        showError('Không thể tải danh sách người like');
      }
    } catch (error) {
      showError('Lỗi khi tải danh sách người like');
    }
  };
  
    // Gọi API khi component được mount
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  
  const handleFollowingPress = () => {
    navigation.navigate(
      "FollowScreen",
      { flag: "following" }
    ); 
  };

  const handleFollowererPress = () => {
    navigation.navigate(
      "FollowScreen",
      { flag: "follower" }
    ); 
  };

  const handleShowLikes = (postId) => {
    fetchLikes(postId);
    setShowLikesModal(true);
  };

  const renderLikeItem = ({ item }) => (
      <View style={styles.likeItem}>
        <Image
          source={item.avtUrl ? { uri: item.avtUrl } : require('../../assets/images/opps.png')}
          style={styles.likeAvatar}
        />
        <Text style={styles.likeName}>{item.name}</Text>
      </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <View style={{ position: "absolute", top: 50, left: -14, zIndex: 5 }}>
          <BackButton color="white" />
        </View>
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/anh1.png")}
            style={styles.backgroundImage}
          />

      
          <View style={styles.profileCard}>
            <View style={styles.profileDetails}>
              <Image
                source={ user.avtUrl ? {uri: user.avtUrl} : require('../../assets/images/profile.png')} 
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.username}>@{user.name}</Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 15,
                    color: "#777",
                  }}
                >
                  <Text style={styles.bioLabel}>Bio: </Text>
                  {user.bio}
                </Text>

                <View style={styles.locationContainer}>
                  <Icon name="location" size={20} color="#009EFD" />
                  <Text style={styles.location}>Ha Noi</Text>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{posts.length}</Text>
                    <Text style={styles.statLabel}>Pods</Text>
                  </View>
                  <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress} activeOpacity={0.7}>
                    <Text style={styles.statNumber}>{user.following.length}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.statItem} onPress={handleFollowererPress} activeOpacity={0.7}>
                    <Text style={styles.statNumber}>{user.followers.length}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>


        <PostList
          posts={posts}
          onShowLikes={handleShowLikes}
          // onDeletePost={handleDeletePost}
          //onEditPost={(postId) => navigation.navigate("EditPost", { postId })} 
        />

    <Modal
      animationType="slide"
      transparent={true}
      visible={showLikesModal}
      onRequestClose={() => setShowLikesModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowLikesModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Người thích bài viết</Text>
            <FlatList
              data={likesList}
              renderItem={renderLikeItem}
              keyExtractor={(item) => item.id}
              style={styles.likesList}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
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
    elevation: 3, // Cho Android
    shadowOffset: { width: 0, height: -3 }, // Cho iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    marginTop: -50,
    marginLeft: 20,
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
  editButton: {
    position: "absolute",
    right: 10,
    top: -25,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  editButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
  bioLabel: {
    color: '#3B82F6',
    fontWeight: 'bold',
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
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
  },
  // post: {
  //   marginVertical: 15,
  // },
  // content: {

  // },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  likesList: {
    flexGrow: 0,
  },
  likeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  likeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  likeName: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;