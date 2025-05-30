import React, { useContext, useState } from 'react';
import {
  SafeAreaView, View, Text, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
  ScrollView, ActivityIndicator, Modal
} from 'react-native';

import { BackButton, Logo, SubTitle, Title, Button, TextGlobal, TextInput } from "../../components";
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { loginService } from '../../service/authService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  
  const { showError } = useToast();

  const navigator = useNavigation();

  const validateEmail = (email) => {
    // Regex kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
      showError('Email không hợp lệ! Vui lòng nhập đúng định dạng email.');
      return;
    }

    try {
      setIsLoading(true); // Bật loading
      const response = await loginService(email, password);
      await login(
        response.data.accessToken,
        response.data.refreshToken
      );
    } catch (e) {
      showError('Email hoặc mật khẩu không đúng!');
    } finally {
      setIsLoading(false); // Tắt loading sau khi API hoàn tất
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView>
            <View style={{ marginTop: 40}}>
              <BackButton />
            </View>
            <View style={styles.logo}><Logo /></View>
            <View style={styles.subTitle}><SubTitle title='Real Social NetWorking' /></View>
            <View style={styles.title}><Title title='Đăng nhập' /></View>
            <View style={styles.input}>
              <TextInput
                iconName='mail'
                label='Email'
                returnKeyType="done"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                label="Mật khẩu"
                returnKeyType="done"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                iconName="lock-closed"
              />
              <Entypo
                style={styles.eyeIcon}
                name={secure ? 'eye' : 'eye-with-line'}
                size={24}
                color="#999"
                onPress={() => setSecure(!secure)}
              />
            </View>
            <View style={{ right: 10 }}>
              <TouchableOpacity onPress={() => navigator.push('ForgotPassword')}>
                <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.loginButton}>
              <TouchableOpacity>
                <Button mode="outlined" title="Đăng nhập" onPress={handleAuth} />
              </TouchableOpacity>
            </View>
            <View style={styles.link}>
              <TextGlobal content='Bạn chưa có tài khoản?' />
              <TouchableOpacity onPress={() => navigator.push('Register')}>
                <TextGlobal content='Đăng ký ngay' color='#009EFD' textDecorationLine='underline' />
              </TouchableOpacity>
            </View>
            <View style={styles.policy}>
              <TextGlobal
                size={10}
                content='By register, you agree to our Terms, Data Policy and Cookies Policy.'
                color='#888'
              />
            </View>
          </ScrollView>
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
          <Text style={styles.loadingText}>Đang đăng nhập...</Text>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    marginTop: 40,
    width: "80%",
    height: 70,
    resizeMode: 'contain',
    marginBottom: 50,
    alignSelf: 'center',
  },
  subTitle: {
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    backgroundColor: '#F2F2F4',
    marginTop: 20,
    borderRadius: 20,
    width: "95%",
    alignSelf: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  forgotPassword: {
    color: '#0099FF',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'right',
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  loginButton: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  policy: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
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
  },
});