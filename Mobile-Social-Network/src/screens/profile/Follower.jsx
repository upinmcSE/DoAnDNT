import React from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { UserProfileCard, BackButton } from "../../components";
import { useNavigation } from "@react-navigation/native";

const Follower = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
          <BackButton color="#777" />
        </View>
        <Text style={styles.headerText}>Người theo dõi</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Following')}>
          <Text style={styles.activeTabText}>Đang theo dõi</Text>
        </TouchableOpacity>
        <View style={styles.tab}>
          <Text style={styles.inactiveTabText}>Người theo dõi</Text>
          <View style={styles.activeTabIndicator}></View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <UserProfileCard />
        </View>
        <View style={styles.cardContainer}>
          <UserProfileCard />
        </View>
        <View style={styles.cardContainer}>
          <UserProfileCard />
        </View>
        <View style={styles.cardContainer}>
          <UserProfileCard />
        </View>
        <View style={styles.cardContainer}>
          <UserProfileCard />
        </View>
        <View style={styles.cardContainer}>
          <UserProfileCard />
        </View>
        <View style={styles.cardContainer}>
          <UserProfileCard />
        </View>
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
    color: "#D1D5DB",
    fontWeight: "700",
    fontSize: 16,
  },
  inactiveTabText: {
    color: "#3B82F6",
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
    alignItems: 'center',
  },
});

export default Follower;