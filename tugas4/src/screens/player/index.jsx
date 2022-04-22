import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Screen from '../../components/screen';

const Player = () => {
    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.audioNumber}>1/23</Text>
                <View style={styles.musicCircleContainer}>
                    <MaterialCommunityIcons
                        name="music-circle"
                        size={300}
                        color='#c9aa88' />
                </View>
                <View style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.title}>audio filename</Text>
                    <View style={styles.durationContainer}>
                        <Text style={styles.duration}>00:00</Text>
                        <Text style={styles.duration}>00:00</Text>
                    </View>
                    <Slider
                        style={{ width: '75%', height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor={'#c9aa88'}
                        maximumTrackTintColor={'#000000'}
                    />
                </View>
                <View style={styles.audioButtonContainer}>

                </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    audioNumber: {
        textAlign: 'right',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    musicCircleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Player;