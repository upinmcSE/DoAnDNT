import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import { BackButton, ItemNotify, Post, UserItem } from "../../components"; // Các thành phần khác
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiClient from '../../service/apiClient';
import { AuthContext } from '../../context/AuthContext';



const SearchList = ({ route }) => {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef(null);

  const searchText  = route.params || "";


  const fetchDatas = async () => {
    try {
      setIsLoading(true);
      console.log(searchText)
      const response = await apiClient.get(`/user/search/${searchText.searchText}`);
      const result = response.data;
      setUsers(result.data.users)
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas()
  },[])


  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        <BackButton color="white" />
        
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Kết quả tìm kiếm</Text>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {users.map((user) => (
          <View key={user._id} style={styles.user}>
            <UserItem userId={user._id} avtUrl={user.avtUrl} name={user.name} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  content: {
    marginTop: 10,
    // paddingHorizontal: 10,
  },
  header: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  user:{
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  post:{
    marginBottom: 12,
  }
});

export default SearchList;