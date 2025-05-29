import React, { useState, useEffect, useContext } from 'react';
import { 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Pressable, 
  TouchableWithoutFeedback, 
  FlatList, 
  Dimensions,
  Modal,
  Text,
  Alert
} from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextGlobal, EditPostModal } from './index';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../service/apiClient';
import { deletePost, likePost, unlikePost } from '../service/postService';
import { useToast } from '../context/ToastContext';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Post = ({ 
  postId, 
  userId, 
  name, 
  avt, 
  content, 
  images, 
  likes,
  comments,
  time, 
  onShowLikes,
  onDeletePost,
}) => {
  const navigation = useNavigation();
  
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [numCmts, setNumCmts] = useState(comments.length);

  const [showDroplist, setShowDroplist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pressTimer, setPressTimer] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {showError, showSuccess, showInfo} = useToast();

  const dropList = [
    user._id !== userId ? "Ẩn" : "Chỉnh sửa",
    user._id !== userId ? "Báo cáo" : "Xóa",
  ];

  // Danh sách các lựa chọn báo cáo (ví dụ)
  const reportOptions = [
    "Nội dung không phù hợp",
    "Spam",
    "Quấy rối",
    "Thông tin sai lệch",
    "Khác",
  ];

  const checkLikeStatus = () => {
  console.log('checkLikeStatus:', {
    postId,
    userId: user._id,
    likes,
    isLiked: likes.includes(user._id.toString())
  });
  setLiked(likes.includes(user._id.toString()));
};

  useEffect(() => {
    checkLikeStatus();
  }, [postId, likes, user._id]);

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const diffInMs = now - postTime;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const handleNavigateProfile = () => {
    if (user._id !== userId) {
      navigation.navigate('User', { userId });
    } else {
      navigation.navigate('MyProfile');
    }
  };

  const toggleDroplist = () => {
    setShowDroplist(!showDroplist);
  };

  const closeDroplist = () => {
    setShowDroplist(false);
  };

  const handleDropListItemPress = (item) => {
    if (item === "Ẩn") {
      console.log("Ẩn bài viết:", postId);
      onDeletePost(postId);
    } else if (item === "Báo cáo") {
      setShowReportModal(true);
    } else if (item === "Chỉnh sửa") {
      setShowEditModal(true);
    } else if (item === "Xóa") {
      handleDeletePost(postId);
    }
    closeDroplist();
  };

  const handleReportOptionPress = (option) => {
    showInfo(`Báo cáo bài viết: ${postId} với lý do: ${option}`);
    onDeletePost(postId);
    setShowReportModal(false);
  };

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity 
      onPress={() => {
        setSelectedImageIndex(index);
        setShowImageModal(true);
      }}
    >
      <Image
        style={styles.contentImg}
        source={{ uri: item }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleToggleLike = async () => {
    try {
      if (liked) {
        const response = await unlikePost(postId);
        const result = response.data;
        if (result.success) {
          setLiked(false);
          setLikesCount(prevLikes => prevLikes - 1);
        } else {
          showError('Lỗi khi bỏ thích bài viết:', result.message);
        }
      } else {
        const response = await likePost(postId);
        const result = response.data;
        if (result.success) {
          setLiked(true);
          setLikesCount(prevLikes => prevLikes + 1);
        } else {
          showError('Lỗi khi thích bài viết:', result.message);
        }
      }
    } catch (error) {
      showError('Lỗi khi gửi yêu cầu:', error.response?.data || error.message);
    }
  };

  const handleHeartPressIn = () => {
    const timer = setTimeout(() => {
      onShowLikes(postId);
    }, 300);
    setPressTimer(timer);
  };

  const handleHeartPressOut = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const renderFullScreenImage = ({ item }) => (
    <Image
      style={styles.fullScreenImage}
      source={{ uri: item }}
      resizeMode="contain"
    />
  );

  const handleFullScreenScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setSelectedImageIndex(index);
  };

  // Hàm xử lý lưu bài viết từ modal
  const handleSavePost = async (updatedData) => {
    const { postId, content, images } = updatedData;
    try {
      const formData = new FormData();
      formData.append("content", content);
      images.forEach((imageUri, index) => {
        formData.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      // const response = await apiClient.put(`/post/${postId}`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // if (response.data.success) {
      //   // Cập nhật giao diện hoặc thông báo thành công nếu cần
      //   console.log("Bài viết đã được cập nhật:", response.data);
      // } else {
      //   console.error("Lỗi khi cập nhật bài viết:", response.data.message);
      // }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu cập nhật:", error);
      throw error; // Ném lỗi để modal xử lý
    }
  };

  const handleDeletePost = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn muốn xóa bài viết này ư",
      [
        {
          text: "Hủy",
          style: "cancel",
          onPress: () => console.log("Đã hủy xóa bài viết"), // Không làm gì khi hủy
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await deletePost(postId);
              if (response.data.success) {
                showSuccess("Bạn vừa xóa bài viết thành công");
                if (onDeletePost) {
                  onDeletePost(postId); // Gọi callback để cập nhật danh sách ở Home
                }
              } else {
                console.error("Lỗi khi xóa bài viết:", response.data.message);
                Alert.alert("Lỗi", "Không thể xóa bài viết. Vui lòng thử lại.");
              }
            } catch (error) {
              console.error("Lỗi khi gửi yêu cầu xóa:", error);
              Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa bài viết.");
            }
          },
        },
      ],
      { cancelable: true } // Cho phép nhấn ngoài Alert để hủy
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
          onPress={handleNavigateProfile}  
        >
          <View style={styles.avtContainer}>
            <Image resizeMode="contain" style={styles.avt} source={avt} />
          </View>
          <View style={styles.name}>
            <TextGlobal color="#000" fontWeight="bold" content={name} />
          </View>
        </TouchableOpacity>

        <View style={{position: 'absolute', right: 20}}>
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={toggleDroplist}
          >
            <Entypo
              name="dots-three-horizontal" 
              size={18} 
              color="#1E88E5"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.content}>
          <TextGlobal size={16} content={content} />
        </View>
        {images && images.length > 0 && (
          <View style={styles.imageWrapper}>
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={SCREEN_WIDTH}
              snapToAlignment="center"
              decelerationRate="fast"
              style={styles.imgContainer}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
            {images.length > 1 && (
              <View style={styles.pagination}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentImageIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <View style={styles.actBtn}>
          <Pressable 
            style={styles.btn} 
            onPress={handleToggleLike}
            onPressIn={handleHeartPressIn}
            onPressOut={handleHeartPressOut}
          >
            <AntDesign 
              color="white" 
              size={24} 
              name={liked ? 'heart' : 'hearto'}
            />
            <TextGlobal color="white" content={likesCount} />
          </Pressable>
          <Pressable 
            style={styles.btn} 
            onPress={() => navigation.navigate(
              'CommentScreen', 
              { content, images, postId }
            )}
          >
            <AntDesign color="#fff" size={24} name="message1" />
            <TextGlobal color="white" content={numCmts} />
          </Pressable>
        </View>
        <View style={styles.time}>
          <TextGlobal fontWeight="bold" color="white" content={getTimeAgo(time)} />
        </View>
      </View>

      {showDroplist && (
        <TouchableWithoutFeedback onPress={closeDroplist}>
          <View style={styles.droplist}>
            {dropList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.droplistItem}
                onPress={() => handleDropListItemPress(item)}
              >
                <TextGlobal color="#000" content={item} />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Modal hiển thị ảnh toàn màn hình */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalOverlay}>
          <FlatList
            data={images}
            renderItem={renderFullScreenImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onScroll={handleFullScreenScroll}
            scrollEventThrottle={16}
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowImageModal(false)}
          >
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
          {images && images.length > 1 && (
            <View style={styles.fullScreenPagination}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.fullScreenDot,
                    selectedImageIndex === index && styles.fullScreenActiveDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>

      {/* Modal báo cáo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReportModal}
        onRequestClose={() => setShowReportModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowReportModal(false)}>
          <View style={styles.reportModalOverlay}>
            <View style={styles.reportModalContent}>
              <Text style={styles.reportModalTitle}>Báo cáo bài viết</Text>
              <FlatList
                data={reportOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.reportOption}
                    onPress={() => handleReportOptionPress(item)}
                  >
                    <Text style={styles.reportOptionText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <EditPostModal
        visible={showEditModal}
        postId={postId}
        initialContent={content}
        initialImages={images}
        onSave={handleSavePost}
        onClose={() => setShowEditModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  avtContainer: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: '#1E88E5',
    borderRadius: 18,
    overflow: 'hidden',
  },
  avt: {
    width: '100%',
    height: '100%',
  },
  name: {
    height: 32,
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 10,
  },
  main: {
    zIndex: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  imgContainer: {
    height: 300,
  },
  contentImg: {
    width: SCREEN_WIDTH,
    height: 300,
    backgroundColor: '#000',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1E88E5',
  },
  actBtn: {
    flexDirection: 'row',
    width: '46%',
    justifyContent: 'space-around',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    alignSelf: 'center',
  },
  droplist: {
    position: 'absolute',
    right: 20,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  droplistItem: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenPagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  fullScreenActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  reportModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  reportModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  reportModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  reportOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reportOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Post;