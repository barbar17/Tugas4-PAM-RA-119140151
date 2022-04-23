import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Screen from '../../components/screen';
import PlayerButton from "../../components/playerbutton";
import { AudioContext } from "../../components/audioprovider";

const Player = () => {
    const context = useContext(AudioContext)
    const {
        playbackPosition,
        playbackDuration,
    } = context;

    const cleanTitle = title => {
        return title.replace(/\.[^/.]+$/, "")
    }

    const calculateSeekBar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    }

    useEffect(() => {
        context.loadPrevAudio();
    }, [])

    if (!context.currentAudio) return null;

    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.audioNumber}>{`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}</Text>
                <View style={styles.musicCircleContainer}>
                    <MaterialCommunityIcons
                        name="music-circle"
                        size={300}
                        color='#c9aa88' />
                </View>
                <View style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.title}>{cleanTitle(context.currentAudio.filename)}</Text>
                    <View style={styles.durationContainer}>
                        <Text style={styles.duration}>00:00</Text>
                        <Text style={styles.duration}>00:00</Text>
                    </View>
                    <Slider
                        style={{ alignSelf: 'center', width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={calculateSeekBar()}
                        minimumTrackTintColor={'#c9aa88'}
                        maximumTrackTintColor={'#000000'}
                    />
                    <View style={styles.audioButtonContainer}>
                        <PlayerButton iconType='PREV' />
                        <PlayerButton
                            size={60}
                            style={{ marginHorizontal: 40 }}
                            iconType={context.isPlaying ? 'PLAY' : 'PAUSE'} />
                        <PlayerButton iconType='NEXT' />
                    </View>
                </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    audioPlayerContainer: {
        paddingHorizontal: 20
    },
    title: {
        marginLeft: 15
    },
    durationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 15,
        alignSelf: 'center'
    },
    audioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    }
})

export default Player;