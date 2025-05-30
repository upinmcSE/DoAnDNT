import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Setting = () => {
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cài đặt</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.profileContainer}>
          <Image
            source={user.avtUrl ? { uri: user.avtUrl } : require("../../assets/images/anhnen.png")}
            resizeMode="cover"
            style={styles.avatar}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.name}>{user.name}</Text>

            <View style={styles.bioContainer}>
              <Text style={styles.bioLabel}>Bio:</Text>
              <Text style={styles.bioText}>
                {user.bio ? user.bio : "Chưa có thông tin bio"}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile")} 
            >
              <Ionicons name="settings" size={18} color="#1E88E5" />
              <Text style={{ paddingLeft: 5 }}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.subTitle}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate("Contribution")}
        >
          <Text style={styles.subTitle}>Góp ý</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out" size={24} color="#E53935" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 70,
    backgroundColor: "#1E88E5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#1E88E5",
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
  },
  bioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  bioLabel: {
    fontWeight: "bold",
    color: "#1E88E5",
    marginRight: 5,
    fontSize: 16,
  },
  bioText: {
    fontSize: 15,
    color: "#666666",
    flex: 1,
  },
  subTitle: {
    fontWeight: "bold",
    color: "#1E88E5",
    marginRight: 5,
    fontSize: 20,
    marginLeft: 5,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
    backgroundColor: "#F3F3F5",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#F3F3F5",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#F3F3F5",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  logoutText: {
    fontSize: 20,
    color: "#E53935",
    fontWeight: "bold",
    marginLeft: 5,
  },
});