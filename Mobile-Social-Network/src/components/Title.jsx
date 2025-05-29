import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
const Title = ({title}) => {
  return (
    <View>
      <Text style={styles.text}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#009EFD',
    fontFamily: 'Roboto'
  }
})

export default Title
