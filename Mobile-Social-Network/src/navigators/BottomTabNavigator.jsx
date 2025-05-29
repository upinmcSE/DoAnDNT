import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Home,
  Chat,
  CreatePost,
  Notification,
  Setting,
} from '../screens/home';

import {
  EditProfile,
  ChangePassword,
  Contribution,
} from '../screens/setting';

import {
  MessageChat
} from '../screens/message';

import {
  CommentScreen,
  User
} from '../screens/post';
 
import {
  MyProfile,
  FollowScreen
} from '../screens/profile';

import {
  SearchList,
} from '../screens/search';

import {
  FontAwesome,
  AntDesign,
  Entypo,
  Feather,
  Ionicons
} from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSocket } from '../context/SocketContext';


// Stack Navigator cho từng tab
const HomeStack = createStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={Home} />
    <HomeStack.Screen name="CommentScreen" component={CommentScreen} />
    <HomeStack.Screen name="MyProfile" component={MyProfile} />
    <HomeStack.Screen name="FollowScreen" component={FollowScreen} />
    <HomeStack.Screen name="User" component={User} />
    <HomeStack.Screen name="SearchList" component={SearchList} />
  </HomeStack.Navigator>
);

const ChatStack = createStackNavigator();
const ChatStackNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="ChatScreen" component={Chat} />
    <ChatStack.Screen name="MessageChat" component={MessageChat} />
  </ChatStack.Navigator>
);

const CreatePostStack = createStackNavigator();
const CreatePostStackNavigator = () => (
  <CreatePostStack.Navigator screenOptions={{ headerShown: false }}>
    <CreatePostStack.Screen name="CreatePostScreen" component={CreatePost} />
  </CreatePostStack.Navigator>
);

const NotificationStack = createStackNavigator();
const NotificationStackNavigator = () => (
  <NotificationStack.Navigator screenOptions={{ headerShown: false }}>
    <NotificationStack.Screen name="NotificationScreen" component={Notification} />
  </NotificationStack.Navigator>
);


const SettingStack = createStackNavigator();
const SettingStackNavigator = () => (
  <SettingStack.Navigator screenOptions={{ headerShown: false }}>
    <SettingStack.Screen name="SettingScreen" component={Setting} />
    <SettingStack.Screen name="EditProfile" component={EditProfile} />
    <SettingStack.Screen name="ChangePassword" component={ChangePassword} />
    <SettingStack.Screen name="Contribution" component={Contribution} />
  </SettingStack.Navigator>
);

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  const { numberMessages, numberNotification } = useSocket();
  

  return (
    <>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1E88E5',
          tabBarInactiveTintColor: 'gray',
        }}
        screenListeners={({ navigation }) => ({
          tabPress: (e) => {
            if (e.target?.includes('Home')) {
              // Điều hướng về HomeScreen và gửi param để làm mới
              navigation.navigate('Home', {
                screen: 'HomeScreen',
                params: { shouldRefresh: Date.now() }, // Dùng timestamp để đảm bảo thay đổi
              });
            }
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatStackNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-ellipses-sharp" size={26} color={color} />
            ),
            tabBarBadge: numberMessages > 0 ? numberMessages : null,
            tabBarBadgeStyle: {
              backgroundColor: '#fe0000',
            }
          }}
        />
        <Tab.Screen
          name="CreatePost"
          component={CreatePostStackNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Entypo name="new-message" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationStackNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="notifications" size={26} color={color} />
            ),
            tabBarBadge: numberNotification > 0 ? numberNotification : null,
            tabBarBadgeStyle: {
              backgroundColor: '#fe0000',
            }
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingStackNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings" size={26} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigator;