import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
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

      const chatList = response.data.map((conversation) => {
        const participant = conversation.participants[0];
        return {
          id: conversation._id,
          conversationId: conversation._id, 
          name: participant.name,
          avtUrl: participant.avtUrl,
          userId: participant._id,
          lastMessage: conversation.lastMessage.text,
          isRead: conversation.lastMessage.isRead,
          date: conversation.lastMessage.createdAt,
        };
      });

      setListChat(chatList);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lọc danh sách chat dựa trên searchText
  const filteredChatList = useMemo(() => {
    if (!searchText.trim()) {
      return listChat;
    }
    
    return listChat.filter((chat) => {
      const searchLower = searchText.toLowerCase().trim();
      return (
        chat.name.toLowerCase().includes(searchLower) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchLower))
      );
    });
  }, [listChat, searchText]);

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
      // Logic tìm kiếm khi nhấn Enter (nếu cần)
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
                onChangeText={setSearchText} // Real-time search khi gõ
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
        ) : filteredChatList.length > 0 ? (
          <FlatList
            data={filteredChatList} // Sử dụng danh sách đã lọc
            renderItem={({ item }) => (
              <ChatItem
                name={item.name}
                avatar={item.avtUrl}
                isViewed={!item.isRead}
                message={item.lastMessage}
                unreadCount={1}
                date={item.date}
                onPress={async () => {
                  await fetchConversations();
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
            <Text style={{ fontSize: 18, color: "#888" }}>
              {searchText.trim() ? "Không tìm thấy kết quả" : "Không có tin nhắn nào"}
            </Text>
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