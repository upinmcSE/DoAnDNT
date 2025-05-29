import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import PostList from '../../components/PostList';
import HeaderHome from '../../components/HeaderHome';
import { getLikes, getPosts, getPostsNetwork } from '../../service/postService';
import { useToast } from '../../context/ToastContext';

const Home = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { showError, showSuccess, showInfo } = useToast();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState({});

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      let response;
      if (activeTab === 'global') {
        response = await getPosts();
        setPosts(response.data.data);
      } else {
        response = await getPostsNetwork();
        setPosts(response.data.data);
      }
    } catch (error) {
      // showError('Lỗi khi tải bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  // Sử dụng useFocusEffect để reload posts khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [activeTab])
  );

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

  const handleDeletePost = (postId, isOptimistic = false, revert = false) => {
    if (revert) {
      // Revert optimistic update by restoring the post
      setPosts((prevPosts) => {
        if (deletedPosts[postId]) {
          return [...prevPosts, deletedPosts[postId]].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
          );
        }
        return prevPosts;
      });
      setDeletedPosts((prev) => {
        const newDeleted = { ...prev };
        delete newDeleted[postId];
        return newDeleted;
      });
      showError('Không thể xóa bài viết');
      return;
    }

    if (isOptimistic) {
      // Store post for potential reversion
      setPosts((prevPosts) => {
        const deletedPost = prevPosts.find((post) => post._id === postId);
        if (deletedPost) {
          setDeletedPosts((prev) => ({ ...prev, [postId]: deletedPost }));
        }
        return prevPosts.filter((post) => post._id !== postId);
      });
    } else {
      // Confirm deletion
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setDeletedPosts((prev) => {
        const newDeleted = { ...prev };
        delete newDeleted[postId];
        return newDeleted;
      });
      showSuccess('Đã xóa bài viết thành công!');
    }
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
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <HeaderHome
          user={user}
          navigation={navigation}
          onSearchSubmit={(searchText) => {
            if (searchText.trim()) {
              navigation.push('SearchList', { searchText });
            }
          }}
        />

        <View style={styles.healing}>
          <TouchableOpacity
            style={[styles.healingContent, activeTab === 'global' && styles.activeTab]}
            onPress={() => setActiveTab('global')}
          >
            <Text style={activeTab === 'global' ? styles.activeTabText : null}>Global</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.healingContent, activeTab === 'network' && styles.activeTab]}
            onPress={() => setActiveTab('network')}
          >
            <Text style={activeTab === 'network' ? styles.activeTabText : null}>Network</Text>
          </TouchableOpacity>
        </View>

        <PostList
          posts={posts}
          isLoading={isLoading}
          onDeletePost={handleDeletePost}
          onShowLikes={handleShowLikes}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  healing: {
    flexDirection: 'row',
    gap: 16,
    padding: 6,
  },
  healingContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1E88E5',
  },
  activeTabText: {
    color: '#fff',
  },
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

export default Home;