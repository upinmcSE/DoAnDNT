import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderHome = ({ user, navigation, onSearchSubmit }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const textInputRef = useRef(null);

  // Lấy lịch sử tìm kiếm từ AsyncStorage khi component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('searchHistory');
        if (history) {
          setSearchHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error('Lỗi khi tải lịch sử tìm kiếm:', error);
      }
    };
    loadSearchHistory();
  }, []);

  const saveSearchHistory = async (newSearch) => {
    try {
      const updatedHistory = [newSearch, ...searchHistory.filter((item) => item !== newSearch)].slice(0, 10);
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử tìm kiếm:', error);
    }
  };

  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchText('');
    textInputRef.current?.blur();
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      saveSearchHistory(searchText.trim());
      onSearchSubmit(searchText.trim());
      setSearchText('');
      handleCloseSearch();
    }
  };

  const handleSelectHistory = (historyItem) => {
    if (historyItem.trim()) {
      saveSearchHistory(historyItem.trim());
      onSearchSubmit(historyItem.trim());
      handleCloseSearch();
    }
  };

  return (
    <View>
      <View style={styles.header}>
        {isSearchActive ? (
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={handleCloseSearch} style={styles.backButton}>
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
            <Text style={styles.title}>Trang chủ</Text>
            <TouchableOpacity style={{ marginLeft: 130 }} onPress={handleSearchPress}>
              <AntDesign name="search1" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                backgroundColor: 'white',
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#ccc',
                overflow: 'hidden',
              }}
              onPress={() => navigation.navigate('MyProfile')}
            >
              <Image
                source={user?.avtUrl ? { uri: user.avtUrl } : require('../assets/images/opps.png')}
                style={{ width: '100%', height: '100%', borderRadius: 20 }}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {isSearchActive && (
        <View style={styles.historyContainer}>
          {searchHistory.length > 0 ? (
            searchHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => handleSelectHistory(item)}
              >
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noHistoryText}>Chưa có lịch sử tìm kiếm</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    height: 70,
    backgroundColor: '#1E88E5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  backButton: {
    marginRight: 10,
  },
  historyContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
  noHistoryText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default HeaderHome;