import { View, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextGlobal } from "./index";
import { useNavigation } from "@react-navigation/native";
import { deleteComment, deleteReply } from "../service/commentService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { formatTime } from "../utils/timeUtils";


export default function Comment({ commentId, name, content, time, avtUrl, flag, replies, onReply, userX, postId, onDelete }) {
  const navigation = useNavigation();
  const { user: authUser, showError } = useContext(AuthContext);

  const handleDeleteComment = (commentId) => {
    Alert.alert(
      "Xóa bình luận",
      "Bạn có chắc muốn xóa bình luận này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment(commentId);
              onDelete(commentId);
            } catch (error) {
              showError("Lỗi khi xóa bình luận:", error.response?.data || error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteReply = (commentId, replyId) => {
    Alert.alert(
      "Xóa phản hồi",
      "Bạn có chắc muốn xóa phản hồi này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReply(replyId, commentId);
              onDelete(commentId, replyId);
            } catch (error) {
              showError("Lỗi khi xóa phản hồi:", error.response?.data || error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Main Comment */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('UserProfile', { userId: commentId })}
        style={styles.avatarContainer}
      >
        <Image 
          style={[styles.avatar, flag && { borderColor: "#1A73E8", borderWidth: 2 }]} 
          resizeMode="cover" 
          source={avtUrl ? avtUrl : require("../assets/images/opps.png")} 
        />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.contentHeader}>
          <View style={styles.header}>
            <TextGlobal content={name} fontWeight="bold" style={styles.name} />
            {time && <TextGlobal content={formatTime(time)} color="#666" style={styles.time} />}
          </View>
          <TextGlobal content={content} style={styles.commentText} />
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onReply(commentId, null, name)}>
            <TextGlobal content="Trả lời" style={styles.actionText} />
          </TouchableOpacity>
          {flag && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => handleDeleteComment(commentId)}
            >
              <TextGlobal content="Xóa" style={[styles.actionText, styles.deleteText]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Replies Section */}
        {replies && replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {replies.map((reply) => (
              <View key={reply._id} style={styles.replyContainer}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('UserProfile', { userId: reply.user._id })}
                  style={styles.replyAvatarContainer}
                >
                  <Image 
                    style={[styles.replyAvatar, authUser._id === reply.user._id && { borderColor: "#1A73E8", borderWidth: 1 }]} 
                    resizeMode="cover" 
                    source={reply.user.avtUrl ? { uri: reply.user.avtUrl } : require("../assets/images/opps.png")} 
                  />
                </TouchableOpacity>
                <View style={styles.replyContentContainer}>
                  <View style={styles.header}>
                    <TextGlobal content={reply.user.name} fontWeight="bold" style={styles.replyName} />
                    {reply.createdAt && <TextGlobal content={formatTime(reply.createdAt)} color="#666" style={styles.replyTime} />}
                  </View>
                  <TextGlobal content={reply.content} style={styles.replyCommentText} />
                  <View style={styles.replyActionContainer}>
                    {authUser._id === reply.user._id && (
                      <TouchableOpacity 
                        style={[styles.replyActionButton, styles.deleteButton]} 
                        onPress={() => handleDeleteReply(commentId, reply._id)}
                      >
                        <TextGlobal content="Xóa" style={[styles.replyActionText, styles.deleteText]} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 8,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E9ECEF",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contentHeader: {
    padding: 8,
    backgroundColor: "#F5F6FA",
    borderRadius: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    color: "#1A73E8",
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#FFE6E6", // Light red background for delete button
  },
  actionText: {
    fontSize: 12,
    color: "#1A73E8",
    fontWeight: "600",
  },
  deleteText: {
    color: "#D32F2F", // Red text for delete action
  },
  // Reply styles
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 20, // Indentation for replies
  },
  replyContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  replyAvatarContainer: {
    marginRight: 10,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E9ECEF",
  },
  replyContentContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#F5F6FA",
  },
  replyName: {
    fontSize: 13,
    color: "#1A73E8",
  },
  replyTime: {
    fontSize: 11,
    marginLeft: 8,
  },
  replyCommentText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    marginBottom: 6,
  },
  replyActionContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  replyActionButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    marginRight: 8,
  },
  replyActionText: {
    fontSize: 11,
    color: "#1A73E8",
    fontWeight: "600",
  },
});