import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Alert,
  TextInput,
  SafeAreaView,
  Pressable,
} from "react-native";
import { BackButton, Button, Logo, TextGlobal } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { verifyCodeService, resetCodeService } from "../../service/authService";
import { useToast } from "../../context/ToastContext";

const Verify = ({ route }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const navigator = useNavigation();

  const { showError, showSuccess, showInfo } = useToast();

  const { email, expiresAt, flag } = route.params; // Lấy email, expiresAt và flag từ params

  // State cho đếm ngược
  const [timeLeft, setTimeLeft] = useState(null); // Thời gian còn lại (giây)
  const [isExpired, setIsExpired] = useState(false); // Trạng thái hết thời gian

  // Tính toán và đếm ngược thời gian
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const difference = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(difference);
      if (difference <= 0) {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();

    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // Xử lý khi người dùng nhập mã code
  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  // Xử lý khi người dùng nhấn phím Backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
    }
  };

  // Xử lý việc xác thực mã
  const handleVerification = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 4) {
      // Alert.alert("Lỗi", "Vui lòng nhập đủ mã code 4 số");
      showError("Vui lòng nhập đủ mã code 4 số");
      return;
    }

    try {
      const response = await verifyCodeService(email, verificationCode);
      console.log("Response:", JSON.stringify(response.data, null, 2));
      if (response.data.success) {
        if (flag === "register") {
          navigator.navigate("Launcher");
        } else if (flag === "forgot-password") {
          navigator.navigate(
            "ResetPassword", 
            { email }
          ); 
        }
      } else {
        showError("Mã xác thực không đúng");
      }
    } catch (error) {
      console.error("Lỗi:", JSON.stringify(error.response ? error.response.data : { message: error.message }, null, 2));
      showError("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  // Xử lý gửi lại mã
  const handleResendCode = async () => {
    try {
      const response = await resetCodeService(email);

      const newExpiresAt = response.data.expiresAt; // Giả sử API trả về expiresAt mới
      setTimeLeft(Math.floor((new Date(newExpiresAt).getTime() - new Date().getTime()) / 1000));
      setIsExpired(false);
      // Alert.alert("Thành công", "Đã gửi lại mã thành công");
      showSuccess("Đã gửi lại mã thành công");
    } catch (error) {
      console.error("Lỗi:", JSON.stringify(error.response ? error.response.data : { message: error.message }, null, 2));
      // Alert.alert("Lỗi", "Không thể gửi lại mã, vui lòng thử lại sau");
      showError("Không thể gửi lại mã, vui lòng thử lại sau");
    }
  };

  // Chuyển thời gian còn lại thành định dạng phút:giây
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{ marginTop: 40}}>
          <BackButton />
        </View>
        <View
          style={{
            width: "80%",
            marginTop: 50,
            height: 70,
            marginBottom: 40,
            alignSelf: "center",
          }}
        >
          <Logo />
        </View>
        <View style={{ paddingBottom: 30 }}>
          <TextGlobal
            content="Real Social Networking"
            color="#009EFD"
            size={18}
            fontWeight="normal"
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <TextGlobal
            content="Nhập mã xác thực"
            color="#009EFD"
            size={28}
            fontWeight="bold"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 20,
          }}
        >
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.input}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {/* Hiển thị đếm ngược hoặc nút gửi lại mã */}
        {isExpired ? (
          <Pressable style={{ marginBottom: 15 }} onPress={handleResendCode}>
            <TextGlobal
              content="Gửi lại mã"
              color="#009EFD"
              size={20}
              fontWeight="normal"
            />
          </Pressable>
        ) : (
          <View style={{ marginBottom: 15 }}>
            <TextGlobal
              content={`Mã hết hạn sau: ${formatTimeLeft()}`}
              color="#888"
              size={16}
              fontWeight="normal"
            />
          </View>
        )}

        <Button
          style={styles.button}
          mode="outlined"
          onPress={handleVerification}
          title="Xác thực"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
  },
  input: {
    width: 65,
    height: 55,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B7B6BB",
    marginHorizontal: 10,
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export default Verify;