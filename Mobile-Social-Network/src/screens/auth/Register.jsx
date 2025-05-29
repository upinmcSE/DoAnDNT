import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Modal,
  Text
} from 'react-native';
import {
  BackButton,
  Logo,
  SubTitle,
  Title,
  TextInput,
  Button,
  TextGlobal
} from "../../components";
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useToast } from '../../context/ToastContext';
import { registerService } from '../../service/authService';

const Register = () => {
  const navigator = useNavigation();

  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state cho nhập lại mật khẩu
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho loading

  const { showError, showSuccess } = useToast();

  const validateEmail = (email) => {
    // Regex kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Kiểm tra mật khẩu và nhập lại mật khẩu
    if (password !== confirmPassword) {
      showError('Mật khẩu và nhập lại mật khẩu không khớp!');
      return;
    }

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
      showError('Email không hợp lệ! Vui lòng nhập đúng định dạng email.');
      return;
    }

    try {
      setIsLoading(true); // Bật loading
      const response = await registerService(name, email, password);

      if (response.data.success) {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigator.navigate(
          'Verify',
          {
            email: email,
            expiresAt: response.data.data.expiresAt,
            flag: 'register'
          }
        );
      } else {
        showError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (e) {
      showError('Email đã tồn tại!');
    } finally {
      setIsLoading(false); // Tắt loading sau khi API hoàn tất
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={{ marginTop: 40}}>
              <BackButton />
            </View>
            <View style={styles.logo}><Logo /></View>
            <View style={styles.subTitle}><SubTitle title='Real Social NetWorking' /></View>
            <View style={styles.title}><Title title='Đăng ký' /></View>
            <View style={styles.input}>
              <TextInput
                iconName='person'
                label='Họ và tên'
                returnKeyType="done"
                value={name}
                onChangeText={setName}
              />
            </View>
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
                secureTextEntry={secure1}
                iconName="lock-closed"
              />
              <Entypo
                style={styles.eyeIcon}
                name={secure1 ? 'eye' : 'eye-with-line'}
                size={24}
                color="#999"
                onPress={() => setSecure1(!secure1)}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                label="Nhập lại mật khẩu"
                returnKeyType="done"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secure2}
                iconName="lock-closed"
              />
              <Entypo
                style={styles.eyeIcon}
                name={secure2 ? 'eye' : 'eye-with-line'}
                size={24}
                color="#999"
                onPress={() => setSecure2(!secure2)}
              />
            </View>
            <View style={styles.button}>
              <Button mode='outlined' title="Đăng ký" onPress={handleRegister} />
            </View>
            <View style={styles.link}>
              <TextGlobal content='Bạn đã có tài khoản?' />
              <TouchableOpacity onPress={() => navigator.navigate('Login')}>
                <TextGlobal
                  content='Đăng nhập'
                  color='#009EFD'
                  textDecorationLine='underline'
                />
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
          <Text style={styles.loadingText}>Đang đăng ký...</Text>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    gap: 15,
  },
  logo: {
    marginTop: 20,
    paddingHorizontal: 60,
    height: 100,
  },
  subTitle: {
    alignSelf: 'center',
  },
  title: {
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    backgroundColor: '#F2F2F4',
    marginTop: 20,
    borderRadius: 20,
    width: "90%",
    alignSelf: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  button: {
    paddingHorizontal: 80,
    marginTop: 10,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 10,
  },
  policy: {
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