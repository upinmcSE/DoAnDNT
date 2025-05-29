import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({func, color = 'black'}) => {
  
  const navigator = useNavigation();

  return (
    <Pressable 
        style={styles.container}
        onPress={() => navigator.goBack()}
    >
      <Ionicons name="chevron-back" size={30} color={color} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // left: 4, 
    position: 'absolute'
  },
})

export default BackButton
