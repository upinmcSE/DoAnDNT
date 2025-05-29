import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ChatItem } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { getConversations } from "../../service/chatService";

const Chat = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const textInputRef = useRef(null);
  const navigation = useNavigation();
  const [listChat, setListChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await getConversations();
      console.log("Conversations:", response.data);

      // Chuyển đổi dữ liệu conversations thành danh sách hiển thị
      const chatList = response.data.map((conversation) => {
        const participant = conversation.participants[0]; // Lấy participant đầu tiên
        return {
          id: conversation._id,
          conversationId: conversation._id, 
          name: participant.name,
          avtUrl: participant.avtUrl,
          userId: participant._id,
          lastMessage: conversation.lastMessage.text
        };
      });

      setListChat(chatList);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    Keyboard.dismiss();
    setIsSearchActive(false);
    setSearchText("");
    textInputRef.current?.blur();
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      // Có thể thêm logic tìm kiếm ở đây nếu cần
      console.log("Search:", searchText.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          {isSearchActive ? (
            <View style={styles.searchContainer}>
              <TouchableOpacity
                onPress={handleCloseSearch}
                style={styles.backButton}
              >
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                ref={textInputRef}
                style={styles.searchInput}
                placeholder="Tìm kiếm..."
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
                autoFocus={true}
                onSubmitEditing={handleSearchSubmit}
              />
            </View>
          ) : (
            <>
              <Text style={styles.title}>Tin nhắn</Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 20 }}
                onPress={handleSearchPress}
              >
                <AntDesign name="search1" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Danh sách tin nhắn */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "#888" }}>Đang tải...</Text>
          </View>
        ) : listChat.length > 0 ? (
          <FlatList
            data={listChat}
            renderItem={({ item }) => (
              <ChatItem
                name={item.name}
                avatar={item.avtUrl}
                isViewed={false}
                message={item.lastMessage}
                unreadCount={3}
                onPress={() => {
                  navigation.navigate('Chat', {
                    screen: 'MessageChat',
                    params: {
                      conversationId: item.conversationId,
                      userData: {
                        _id: item.userId,
                        name: item.name,
                        avtUrl: item.avtUrl,
                      },
                    },
                  });
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "#888" }}>Không có tin nhắn nào</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
    height: 70,
    backgroundColor: "#1E88E5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
  },
  backButton: {
    marginRight: 10,
  },
});

export default Chat;