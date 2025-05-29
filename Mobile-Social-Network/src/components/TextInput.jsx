import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const TextField = ({ iconName,...props}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={30} color="#B7B6BB" />
      <TextInput
        {...props}
        style={styles.input}
        secureTextEntry={props.secureTextEntry}
        placeholder={props.label}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#F2F2F4',
    alignItems: 'center',
    padding: 15,
    gap: 10
  },
  input: {
    color: '#B7B6BB',
    fontSize: 24,
    fontFamily: 'Roboto',
    width: '100%',
  },
})

export default TextField
