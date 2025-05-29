import React from 'react'
import { StyleSheet, Text } from 'react-native';

const TextGlobal = ({color, content, size, fontWeight, textDecorationLine}) => {
  return (
    <Text style={[styles.text, 
        {color, fontSize: size, fontWeight: fontWeight, 
        textDecorationLine: textDecorationLine}]}>
      {content}
    </Text>
  )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto',
    }
})

export default TextGlobal
