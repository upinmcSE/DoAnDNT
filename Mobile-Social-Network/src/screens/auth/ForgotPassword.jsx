import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Modal,
  Text
} from "react-native";

import {
  BackButton,
  Button,
  Logo,
  SubTitle,
  TextInput,
  Title
} from "../../components";
import { useNavigation } from "@react-navigation/native";
import { forgotPasswordService } from "../../service/authService";
import { useToast } from "../../context/ToastContext";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho loading
  const { showError } = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      showError("Email không hợp lệ! Vui lòng nhập đúng định dạng email.");
      return;
    }

    try {
      setIsLoading(true); // Bật loading
      const response = await forgotPasswordService(email);

      if (response.data.success) {
        navigation.navigate(
          "Verify",
          {
            email: email,
            expiresAt: response.data.data.expiresAt,
            flag: 'forgot-password'
          }
        );
      }
    } catch (err) {
      setIsLoading(false)
      showError("Email không tồn tại !");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={{ marginTop: 40}}>
              <BackButton />
            </View>
            <View style={styles.logo}>
              <Logo />
            </View>
            <View style={styles.subTitle}>
              <SubTitle title='Real Social NetWorking' />
            </View>
            <View style={styles.title}>
              <Title title='Quên mật khẩu' />
            </View>
            <View style={styles.input}>
              <TextInput
                iconName='mail-outline'
                label='Email'
                returnKeyType="done"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.button}>
              <Button mode='outlined' title="Nhập email" onPress={handleSendEmail} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal Loading */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}} // Không cho phép đóng modal bằng nút back
      >
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#009EFD" />
          <Text style={styles.loadingText}>Đang gửi email...</Text>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    gap: 20
  },
  logo: {
    marginTop: 30,
    paddingHorizontal: 60,
    height: 100,
  },
  subTitle: {
    alignSelf: 'center',
  },
  title: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  input: {
    marginHorizontal: -30,
    alignItems: 'center',
    marginVertical: 5
  },
  button: {
    paddingHorizontal: 80,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  }
});