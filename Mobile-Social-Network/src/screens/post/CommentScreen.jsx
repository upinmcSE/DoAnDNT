import React, { useState, useEffect, useContext, useRef } from "react";
import { 
  SafeAreaView, 
  View, 
  Image, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Dimensions, 
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { TextGlobal } from "../../components";
import Comment from "../../components/Comment";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { createComment, createReply, getComments } from "../../service/commentService"; 
import { getPostByPostId } from "../../service/postService";
import { useToast } from "../../context/ToastContext";

const { width } = Dimensions.get('window');

export default function CommentScreen({ route }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { postId } = route.params || {};

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [targetCommentId, setTargetCommentId] = useState(null);
  const [targetReplyId, setTargetReplyId] = useState(null);
  const [targetUserName, setTargetUserName] = useState(null);
  const textInputRef = useRef(null);

  const { showError, showSuccess, showInfo } = useToast();

  const fetchPost = async () => {
    try {
      const response = await getPostByPostId(postId);
      setPost(response.data.data);
    } catch (error) {
      showError("Lỗi khi tải bài viết:", error.response?.data || error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      const result = response.data;
      setComments(result.data);
    } catch (error) {
      showError("Lỗi khi tải bình luận:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const handleSendComment = async () => {
    if (!commentInput.trim()) {
      showInfo("Vui lòng nhập bình luận trước khi gửi.");
      return;
    }
    try {
      if (targetCommentId) {
        await createReply(targetCommentId, commentInput);
        showSuccess("Gửi phản hồi thành công!");
      } else {
        await createComment(postId, commentInput);
        showSuccess("Gửi bình luận thành công!");
      }
      setCommentInput("");
      setTargetCommentId(null);
      setTargetReplyId(null);
      setTargetUserName(null);
      Keyboard.dismiss();
      await fetchComments();
    } catch (error) {
      showError("Lỗi khi gửi:", error.response?.data || error.message);
    }
  };

  const handleReply = (commentId, replyId, userName) => {
    setTargetCommentId(commentId);
    setTargetReplyId(replyId);
    setTargetUserName(userName);
    textInputRef.current?.focus();
  };

  const handleDelete = (commentId, replyId) => {
    if (replyId) {
      // Xóa phản hồi cục bộ
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(reply => reply._id !== replyId),
              }
            : comment
        )
      );
    }
    // Gọi fetchComments để đồng bộ với server
    fetchComments();
    showSuccess("Xóa thành công!");
  };

  const renderImage = ({ item }) => (
    <View style={styles.slide}>
      <Image 
        source={{ uri: item }} 
        style={styles.contentImg}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.swiperWrapper}>
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={post.imageUrls}
              renderItem={renderImage}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />
          ) : (
            <Text style={styles.noImageText}>Không có ảnh để hiển thị</Text>
          )}
        </View>

        {/* Comment Section */}
        <View style={styles.cmtContainer}>
          <View style={styles.headerCmt}>
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" color="gray" size={26} />
            </Pressable>
            <TextGlobal 
              content={post.content || "Comments"} 
              size={20} 
              fontWeight="bold" 
            />
          </View>
          <ScrollView 
            style={styles.scrollViewCmt}
            contentContainerStyle={styles.scrollViewContent}
          >
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  commentId={comment._id}
                  avtUrl={comment.user.avtUrl ? { uri: comment.user.avtUrl } : require("../../assets/images/opps.png")}
                  name={comment.user.name}
                  content={comment.content}
                  time={comment.createdAt}
                  flag={user._id === comment.user._id}
                  replies={comment.replies || []}
                  onReply={(commentId, replyId) => handleReply(commentId, replyId, comment.user.name)}
                  userX={user}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <Text style={styles.noCommentText}>Chưa có bình luận nào</Text>
            )}
          </ScrollView>
          <View style={styles.inpContainer}>
            <TextInput 
              ref={textInputRef}
              placeholder={targetUserName ? `Trả lời ${targetUserName}` : "Viết bình luận của bạn"} 
              style={styles.input} 
              placeholderTextColor="#888"
              value={commentInput}
              onChangeText={setCommentInput}
            />
            <Pressable onPress={handleSendComment}>
              <FontAwesome name="send" color="gray" size={20} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  swiperWrapper: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    width: Dimensions.get('window').width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentImg: {
    width: "100%", 
    height: "100%",
    backgroundColor: '#ddd',
  },
  cmtContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 8,
  },
  headerCmt: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewCmt: {
    width: "100%",
    paddingHorizontal: 4,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  inpContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: {
    backgroundColor: "#f2f2f4",
    borderRadius: 50,
    paddingHorizontal: 12,
    flex: 1,
    height: 40,
  },
  noImageText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  noCommentText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
});