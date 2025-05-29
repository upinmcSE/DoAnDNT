import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import TextGlobal from './TextGlobal'

const ItemMessage = ({avtUrl, name, messageEnd, time}) => {
  return (
    <Pressable style={styles.container}>
        <View style={styles.avt}></View>
        <View style={styles.content}>
            <View style={styles.name}>
                <TextGlobal content="Dương Trung Thành" size={16} fontWeight={500} />
            </View>
            <View style={styles.message_container}>
                <View>
                    <TextGlobal content="Chào em qưeqweqwe" size={13} />
                </View>
                <View>
                    <TextGlobal content="17:06" size={13} />
                </View>
            </View>
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
        width: '100%',
        gap: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#F2F2F4'
    },
    avt: {
        width: 50,
        height: 50,
        backgroundColor: 'gray',
        borderRadius: 25
    },
    content: {
        flexDirection: 'column',
        flex: 1,
        gap: 8
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16
    },
    message_container :{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})

export default ItemMessage
