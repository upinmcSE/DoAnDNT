import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert, TextInput } from "react-native";
import { Button, BackButton } from "../../components";
import Entypo from 'react-native-vector-icons/Entypo';

const ChangePassword = () => {
  const [password, setPassword] = useState(''); // Mật khẩu cũ
  const [newPassword, setNewPassword] = useState(''); // Mật khẩu mới
  const [confirmPassword, setConfirmPassword] = useState(''); // Nhập lại mật khẩu mới
  const [secure, setSecure] = useState(true);
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  const handleChangePassword = () => {
    if (!password || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không trùng khớp với mật khẩu mới.");
      return;
    }
    // Thực hiện logic đổi mật khẩu ở đây
    // Gửi yêu cầu đổi mật khẩu với mật khẩu cũ và mật khẩu mới
    Alert.alert("Thành công", "Mật khẩu đã được đổi thành công.");
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton color='white' />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Đổi mật khẩu</Text>
          </View>
          
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Entypo name="lock" size={24} color="#999" />
          </View>
          <TextInput
            placeholder="Nhập mật khẩu cũ"
            returnKeyType="next"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={styles.input}
          />
          <Entypo
            style={styles.eyeIcon}
            name={secure ? 'eye' : 'eye-with-line'}
            size={24} color="#999"
            onPress={() => setSecure(!secure)} 
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Entypo name="lock" size={24} color="#999" />
          </View>
          <TextInput
            placeholder="Nhập mật khẩu mới"
            returnKeyType="next"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secure1}
            style={styles.input}
          />
          <Entypo
            style={styles.eyeIcon}
            name={secure1 ? 'eye' : 'eye-with-line'}
            size={24} color="#999"
            onPress={() => setSecure1(!secure1)} 
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Entypo name="lock" size={24} color="#999" />
          </View>
          <TextInput
            placeholder="Nhập lại mật khẩu mới"
            returnKeyType="done"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secure2}
            style={styles.input}
          />
          <Entypo
            style={styles.eyeIcon}
            name={secure2 ? 'eye' : 'eye-with-line'}
            size={24} color="#999"
            onPress={() => setSecure2(!secure2)} 
          />
        </View>

        <View style={styles.btnContainer}>
          <Button mode='outlined' title='Lưu' style={{ width: '50%', backgroundColor: "#1E88E5" }} onPress={handleChangePassword} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: 70,
    backgroundColor: "#1E88E5",
    marginBottom: 10,
  },
  inputContainer: {
    paddingHorizontal: 4,
    marginTop: 40,
    width: "95%",
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f4',
    borderRadius: 10,
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  input: {
    height: 60,
    flex: 1,
    padding: 8
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: 50,
  }
});

export default ChangePassword;