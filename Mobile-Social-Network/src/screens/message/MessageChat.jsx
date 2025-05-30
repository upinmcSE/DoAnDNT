import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { sendMessage, getMessages, readMessage, blockMassage } from "../../service/chatService";

const MessageChat = ({ route }) => {
  const { conversationId, userData } = route.params;
  const { fetchUnreadMessages } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State for image preview
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false); // State for image preview modal
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessages(conversationId);
        const result = response.data;

        const messages = result.messages.map((msg) => ({
          id: msg._id,
          text: msg.text,
          imageUri: msg.imageUrl && msg.imageUrl.length > 0 ? msg.imageUrl[0] : null,
          sender: msg.senderId === user._id ? "me" : "other",
          date: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: msg.isRead,
        })) || [];

        setMessages(messages);

        const unreadMessages = messages.filter(
          (msg) => msg.sender === "other" && !msg.isRead
        );
        console.log("Unread messages:", unreadMessages.map((msg) => msg.id));

        const readMessagePromises = unreadMessages.map(async (msg) => {
          try {
            await readMessage(msg.id);
            return { id: msg.id, success: true };
          } catch (error) {
            console.error(`Error marking message ${msg.id} as read:`, error);
            return { id: msg.id, success: false };
          }
        });

        const results = await Promise.all(readMessagePromises);
        console.log("Read message results:", results);

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            results.some((result) => result.id === msg.id && result.success)
              ? { ...msg, isRead: true }
              : msg
          )
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    fetchUnreadMessages();
  }, [conversationId, user._id]);

  // Socket.IO setup
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinConversation", conversationId);

    socket.on("newMessage", (message) => {
      console.log("Received new message:", message);
      if (message.conversationId === conversationId) {
        const newMsg = {
          id: message._id || (messages.length + 1).toString(),
          text: message.text,
          imageUri: message.imageUrl && message.imageUrl.length > 0 ? message.imageUrl[0] : null,
          sender: message.senderId === user._id ? "me" : "other",
          date: new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, newMsg]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.emit("leaveConversation", conversationId);
      socket.off("newMessage");
    };
  }, [socket, conversationId, user._id]);

  // Handle sending text message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", newMessage);

      const response = await sendMessage(userData._id, formData);

      const newMsg = {
        id: response._id || (messages.length + 1).toString(),
        text: newMessage,
        sender: "me",
        date: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");
      flatListRef.current?.scrollToEnd({ animated: true });

      if (socket) {
        socket.emit("sendMessage", {
          conversationId,
          senderId: user._id,
          receiverId: userData._id,
          text: newMessage,
          imageUrl: [],
          createdAt: new Date().toISOString(),
          _id: response._id,
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Handle picking and previewing image
  const handlePickImage = async () => {
    if (loading) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setImagePreviewVisible(true); // Show preview modal
      }
    } catch (error) {
      console.error("Lỗi khi chọn hình ảnh:", error);
      alert("Không thể chọn hình ảnh. Vui lòng thử lại!");
    }
  };

  // Handle sending image after preview
  const handleSendImage = async () => {
    if (!selectedImage || loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", newMessage || "");
      formData.append("images", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "image.jpg",
      });

      const response = await sendMessage(userData._id, formData);

      const newImageMsg = {
        id: response._id || (messages.length + 1).toString(),
        text: newMessage || "",
        imageUri: response.imageUrl && response.imageUrl.length > 0 ? response.imageUrl[0] : selectedImage,
        sender: "me",
        date: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...messages, newImageMsg]);
      setNewMessage("");
      setSelectedImage(null);
      setImagePreviewVisible(false);
      flatListRef.current?.scrollToEnd({ animated: true });

      if (socket) {
        socket.emit("sendMessage", {
          conversationId,
          senderId: user._id,
          receiverId: userData._id,
          text: newMessage || "",
          imageUrl: [response.imageUrl || selectedImage],
          createdAt: new Date().toISOString(),
          _id: response._id,
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi hình ảnh:", error);
      alert("Không thể gửi hình ảnh. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Handle recalling message
  const handleRecallMessage = async () => {
    if (!selectedMessageId) return;

    try {
      setLoading(true);
      await blockMassage(selectedMessageId);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === selectedMessageId
            ? { ...msg, text: "Tin nhắn đã thu hồi", isRecalled: true, imageUri: null }
            : msg
        )
      );
      setModalVisible(false);
      setSelectedMessageId(null);
      if (socket) {
        socket.emit("recallMessage", {
          conversationId,
          messageId: selectedMessageId,
        });
      }
    } catch (error) {
      console.error("Lỗi thu hồi tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender === "me";
    const showAvatar =
      item.sender === "other" &&
      (index === 0 || messages[index - 1].sender !== "other");
    const showDate =
      index === 0 || messages[index].date !== messages[index - 1].date;

    return (
      <>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            if (isMe && !item.isRecalled) {
              setSelectedMessageId(item.id);
              setModalVisible(true);
            }
          }}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.messageContainer,
              isMe ? styles.messageContainerMe : styles.messageContainerOther,
            ]}
          >
            {showAvatar && (
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    userData?.avtUrl
                      ? { uri: userData.avtUrl }
                      : require("../../assets/images/opps.png")
                  }
                  style={styles.avatar}
                />
              </View>
            )}
            {!showAvatar && !isMe && <View style={styles.avatarPlaceholder} />}
            {item.isRecalled ? (
              <View
                style={isMe ? styles.messageBubbleMe : styles.messageBubbleOther}
              >
                <Text
                  style={isMe ? styles.messageTextMe : styles.messageTextOther}
                >
                  {item.text}
                </Text>
              </View>
            ) : item.imageUri ? (
              <Image
                source={{ uri: item.imageUri }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={isMe ? styles.messageBubbleMe : styles.messageBubbleOther}
              >
                <Text
                  style={isMe ? styles.messageTextMe : styles.messageTextOther}
                >
                  {item.text}
                </Text>
              </View>
            )}
              {/* {isMe && item.isRead && !item.isRecalled && (
                <Text style={styles.readStatus}>Đã đọc</Text>
              )} */}
          </View>
        </TouchableOpacity>
      </>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={
              userData?.avtUrl
                ? { uri: userData.avtUrl }
                : require("../../assets/images/opps.png")
            }
            style={styles.headerAvatar}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>
            {userData?.name || "Người dùng"}
          </Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={handlePickImage}>
            <Feather name="paperclip" size={24} color="#888" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Feather name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal for recalling message */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleRecallMessage}
                >
                  <Text style={styles.modalButtonText}>Thu hồi tin nhắn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal for image preview */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imagePreviewVisible}
        onRequestClose={() => setImagePreviewVisible(false)}
      >
        <View style={styles.imagePreviewModal}>
          <View style={styles.imagePreviewContainer}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.previewButtonContainer}>
              <TouchableOpacity
                style={[styles.previewButton, styles.cancelButton]}
                onPress={() => {
                  setImagePreviewVisible(false);
                  setSelectedImage(null);
                }}
              >
                <Text style={styles.previewButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={handleSendImage}
              >
                <Text style={styles.previewButtonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#1E88E5",
  },
  headerLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerRightPlaceholder: {
    width: 24,
  },
  messageList: {
    padding: 10,
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    fontSize: 12,
  },
  messageContainer: {
    marginBottom: 4,
    flexDirection: "row",
  },
  messageContainerMe: {
    justifyContent: "flex-end",
  },
  messageContainerOther: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 36,
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageBubbleMe: {
    backgroundColor: "#1E88E5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: "70%",
  },
  messageBubbleOther: {
    backgroundColor: "#E9E9E9",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: "70%",
  },
  messageTextMe: {
    color: "white",
    fontSize: 15,
  },
  messageTextOther: {
    color: "black",
    fontSize: 15,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  readStatus: {
    fontSize: 10,
    color: "#666",
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#1E88E5",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "60%",
    alignItems: "center",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#1E88E5",
    fontWeight: "500",
  },
  imagePreviewModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreviewContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  previewButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  previewButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#1E88E5",
  },
  previewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MessageChat;