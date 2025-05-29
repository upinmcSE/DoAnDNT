import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
const SubTitle = ({title}) => {
  return (
    <View>
      <Text style={styles.text} >{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#009EFD',
    fontFamily: 'Roboto'
  }
})


export default SubTitle
