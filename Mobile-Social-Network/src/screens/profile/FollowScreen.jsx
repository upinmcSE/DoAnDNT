// src/screens/FollowScreen.jsx
import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { UserProfileCard, BackButton } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

const FollowScreen = ({ route }) => {
  const navigation = useNavigation();
  const flag = route.params?.flag;
  const [activeTab, setActiveTab] = useState(flag || "following");

  const { user } = useContext(AuthContext);

  const followingList = user.following

  const followerList = user.followers

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
          <BackButton color="#777" />
        </View>
        <Text style={styles.headerText}>
          {activeTab === "following" ? "Đang theo dõi" : "Người theo dõi"}
        </Text>
      </View>

      {/* Thanh tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("following")}
        >
          <Text
            style={
              activeTab === "following"
                ? styles.activeTabText
                : styles.inactiveTabText
            }
          >
            Đang theo dõi
          </Text>
          {activeTab === "following" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("follower")}
        >
          <Text
            style={
              activeTab === "follower"
                ? styles.activeTabText
                : styles.inactiveTabText
            }
          >
            Người theo dõi
          </Text>
          {activeTab === "follower" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {(activeTab === "following" ? followingList : followerList).map((user) => (
          <View key={user} style={styles.cardContainer}>
            <UserProfileCard userId={user} flag={activeTab}/>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    color: "#3B82F6",
    fontSize: 20,
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  activeTabText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 16,
  },
  inactiveTabText: {
    color: "#D1D5DB",
    fontWeight: "700",
    fontSize: 16,
  },
  activeTabIndicator: {
    height: 6,
    backgroundColor: "#34D399",
    marginTop: 4,
    width: "100%",
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  cardContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
});

export default FollowScreen;