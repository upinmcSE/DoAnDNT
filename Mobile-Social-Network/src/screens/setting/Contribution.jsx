import { SafeAreaView, View, StyleSheet, TextInput, Modal, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, BackButton } from "../../components";
import { Text } from "react-native";
import React, { useState } from 'react';

export default function Contribution() {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  const handleSend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setText("");
    }, 2000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton color='white'/>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Góp ý</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Viết góp ý của bạn'
            numberOfLines={5}
            style={styles.input}
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button mode='outlined' title='Gửi' style={{width:'50%', backgroundColor: '#1E88E5'}} onPress={handleSend} />
        </View>

        {/* Modal Loading */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={isLoading}
          onRequestClose={() => {}}
        >
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.loadingText}>Đang gửi...</Text>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "white"
  },
  header: {
    flexDirection:'row',
    alignItems:'center',
    width: "100%",
    height: 70,
    backgroundColor: "#1E88E5",
    marginBottom: 20,
  },
  inputContainer: {
    paddingHorizontal: 6,
  },
  input: {
    backgroundColor: '#f2f2f4',
    height: 160,
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
  },
  btnContainer: {
    alignItems: 'center',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
});