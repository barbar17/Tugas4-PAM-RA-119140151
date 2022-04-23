import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Screen from '../../components/screen';
import PlayerButton from "../../components/playerbutton";
import { AudioContext } from "../../components/audioprovider";
import { next, pause, play, resume } from "../../components/audiocontroller";
import { storeAudioForNextOpening } from "../../components/helper";

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

    const handlePlayPause = async () => {
        if (context.sound === null) {
            const audio = context.currentAudio;
            const status = await play(context.playback, audio.uri);
            context.playback.setOnPlaybackStatusUpdate(context.onPlaybackStatusUpdate);
            return context.updateState(context, {
                sound: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: context.currentAudioIndex
            })
        }

        if (context.sound && context.sound.isPlaying) {
            const status = await pause(context.playback);
            return context.updateState(context, {
                sound: status,
                isPlaying: false,
            })
        }

        if (context.sound && !context.sound.isPlaying) {
            const status = await resume(context.playback);
            return context.updateState(context, {
                sound: status,
                isPlaying: true,
            })
        }
    }

    const handleNext = async () => {
        const { isLoaded } = await context.playback.getStatusAsync();
        const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
        let audio = context.audioFile[context.currentAudioIndex + 1];
        let index;
        let status;

        if (!isLoaded && !isLastAudio) {
            index = context.currentAudioIndex + 1;
            status = await play(context.playback, audio.uri);
        }

        if (isLoaded && !isLastAudio) {
            index = context.currentAudioIndex + 1;
            status = await next(context.playback, audio.uri);
        }

        if (isLastAudio) {
            index = 0;
            audio = context.audioFile[index];
            if (isLoaded) {
                status = await next(context.playback, audio.uri);
            } else {
                status = await play(context.playback, audio.uri);
            }
        }

        context.updateState(context, {
            currentAudio: audio,
            playback: context.playback,
            sound: status,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,
        });
        storeAudioForNextOpening(audio, index);
    };

    const handlePrev = async () => {
        const { isLoaded } = await context.playback.getStatusAsync();
        const isFirstAudio = context.currentAudioIndex <= 0;
        let audio = context.audioFile[context.currentAudioIndex - 1];
        let index;
        let status;

        if (!isLoaded && !isFirstAudio) {
            index = context.currentAudioIndex - 1;
            status = await play(context.playback, audio.uri);
        }

        if (isLoaded && !isFirstAudio) {
            index = context.currentAudioIndex - 1;
            status = await next(context.playback, audio.uri);
        }

        if (isFirstAudio) {
            index = context.totalAudioCount - 1;
            audio = context.audioFile[index];
            if (isLoaded) {
                status = await next(context.playback, audio.uri);
            } else {
                status = await play(context.playback, audio.uri);
            }
        }

        context.updateState(context, {
            currentAudio: audio,
            playback: context.playback,
            sound: status,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,
        });
        storeAudioForNextOpening(audio, index);
    };

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
                        <PlayerButton onPress={handlePrev} iconType='PREV' />
                        <PlayerButton
                            onPress={handlePlayPause}
                            size={60}
                            style={{ marginHorizontal: 40 }}
                            iconType={context.isPlaying ? 'PLAY' : 'PAUSE'} />
                        <PlayerButton onPress={handleNext} iconType='NEXT' />
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