import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Text,
  ActivityIndicator, 
  RefreshControl, 
} from 'react-native';
import Post from '../components/Post';
import { useToast } from '../context/ToastContext';

const PostList = ({ posts, isLoading, onDeletePost, onShowLikes }) => {
  const [refreshing, setRefreshing] = useState(false);

  const { showError } = useToast();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const renderPost = useCallback(({ item }) => (
    <View style={styles.post}>
      <Post
        postId={item._id}
        userId={item.userId._id}
        name={item.userId.name}
        avt={item.userId.avtUrl ? { uri: item.userId.avtUrl } : require('../assets/images/opps.png')}
        content={item.content}
        images={item.imageUrls}
        likes={item.likes}
        comments={item.comments}
        time={item.createdAt}
        onShowLikes={() => onShowLikes(item._id)}
        onDeletePost={() => onDeletePost(item._id, true)}
      />
    </View>
  ), [onDeletePost, onShowLikes]);

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item._id.toString()}
      style={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#1E88E5"
          colors={['#1E88E5']}
        />
      }
      ListFooterComponent={isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      ) : null}
      ListEmptyComponent={isLoading ? null : (
        <View style={styles.emptyContainer}>
          <Text>Không có bài viết nào.</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  post: {
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostList;