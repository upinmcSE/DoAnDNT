import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';


const UserItem = ({userId, avtUrl, name}) => {
  const { user } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(user.following.includes(userId));
  const navigation = useNavigation();

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <TouchableOpacity 
    onPress={() => {
      if (userId !== user._id) {
        navigation.navigate("User", { userId });
      }
    }}
    style={styles.container}>
      <Image
        source={
          avtUrl
            ? { uri: avtUrl }
            : require("../assets/images/opps.png")
        }
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{name}</Text>
          </View>
          {userId !== user._id && (
            <TouchableOpacity
              style={[styles.button, isFollowing ? styles.unfollowButton : styles.followButton]}
              onPress={handleFollowToggle}
            >
              <Text style={styles.buttonText}>{isFollowing ? "Unfollow" : "Follow"}</Text>
            </TouchableOpacity> 
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    height: 120,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: 'gray',
  },
  button: {
    width: 95,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,

  },
  followButton: {
    backgroundColor: 'rgb(74, 238, 189)'

  },
  unfollowButton: {
    backgroundColor: '#777',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserItem;