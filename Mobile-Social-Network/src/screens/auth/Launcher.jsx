import React from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';
import logo from '../../../assets/images/logo.png';
import { SubTitle, Button } from '../../components';
import { useNavigation } from '@react-navigation/native';

const Launcher = () => {

  const navigator = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <Image source={require('../../../assets/images/anhnen.png')} style={styles.imageTop} />
      </View>

      <View style={styles.bottomContent}>
        <Image source={logo} style={styles.logo} />
        
        <View style={styles.titleContainer}>
          <SubTitle title="Real Social Networking" />
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="outlined" title="Đăng nhập" onPress={() => navigator.push('Login')}/>
          <View style={{ height: 15 }} />
          <Button title="Đăng ký" onPress={() => navigator.push('Register')}/>
        </View>
      </View>
    </View>
  );
};

export default Launcher;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBackground: {
    height: '50%',
    width: '100%',
    backgroundColor: '#0099FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 255,
    height: 60,
    resizeMode: 'contain',
    marginVertical: 15,

  },
  titleContainer: {
    marginBottom: 50,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
});
