import React from 'react'
import { View, StyleSheet, Image } from 'react-native'


const Logo = () => {
  return (
    <View>
      <Image 
        source={require('../assets/images/logo.png')} 
        style={styles.image}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
    }
})

export default Logo
