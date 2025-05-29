import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Button as PaperButton } from 'react-native-paper'

const Button = ({ mode, style, title, ...props }) => {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' ? { backgroundColor: '#1AE4A6' } : { backgroundColor: '#009EFD' },
        style
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    >
      {title}
    </PaperButton>



  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    borderColor: 'white',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 26,
    color: 'white',
    fontFamily: 'Roboto'
  },
})

export default Button