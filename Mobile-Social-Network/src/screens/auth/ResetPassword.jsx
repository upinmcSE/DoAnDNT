import React, { useState } from "react";
import { 
  SafeAreaView, 
  StyleSheet, 
  View,

} from "react-native";
import {
  BackButton,
  Button,
  TextInput,
  Logo,
  TextGlobal,
} from "../../components";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../service/apiClient";

const ResetPassword = ({ route }) => {
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const { email } = route.params;

  const navigator = useNavigation();

  const handleUpdatePassword = async () => {
    if (password != null) {
      try{
        const response = await apiClient.post("/auth/reset-password", {email, password})
        if(response.data.success){
          navigator.navigate("Launcher")
        }else{
          console.log("Lỗi", "Lỗi không đổi được mật khẩu")
        }
      }catch(err){
        console.log(err)
      }
    }
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
        <View>
          <TextGlobal
            content="Cập nhật mật khẩu"
            color="#009EFD"
            size={28}
            fontWeight="bold"
          />
        </View>

        <View style={styles.input}>
          <TextInput
            label="Nhập lại mật khẩu"
            returnKeyType="done"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={secure}
          />
          <Entypo
            style={styles.eyeIcon}
            name={secure ? 'eye' : 'eye-with-line'}
            size={24} color="#999"
            onPress={() => setSecure(!secure)} />
        </View>

        
        <Button
          style={styles.button}
          mode="outlined"
          onPress={handleUpdatePassword}
          title="Cập nhật"
        >
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  content: {
    alignItems: "center",
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    backgroundColor: '#F2F2F4',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#B3B3B3',
    borderRadius: 10,
    width: "90%",
    alignSelf: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  passwordIcon: {
    position: 'absolute',
    right: 15,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});

export default ResetPassword;
