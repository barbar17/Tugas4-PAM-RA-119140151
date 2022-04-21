import React from 'react'
import { Text, View, Modal, StyleSheet, Pressable } from 'react-native'

const OptionModal = ({ visible, closeModal, currentItem, playPress, playListPress }) => {

    return (
        <>
            <Modal animationType='slide' transparent={true} visible={visible} >
                <Pressable onPress={closeModal} style={styles.bg}>
                    <View style={styles.container}>
                        <Text numberOfLines={2} style={styles.title}>{currentItem}</Text>
                        <View style={styles.optionContainer}>
                            <Pressable onPress={playPress}>
                                <Text style={styles.option}>Putar Lagu</Text>
                            </Pressable>
                            <Pressable onPress={playListPress}>
                                <Text style={styles.option}>Tambahkan Ke Playlist</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    optionContainer: {
        padding: 20,
    },
    option: {
        fontSize: 16,
        paddingVertical: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
})

export default OptionModal;