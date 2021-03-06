import React, { Component, createContext } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../helper';
import { next } from '../audiocontroller';

export const AudioContext = createContext()

export class AudioProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            audioFile: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playback: null,
            sound: null,
            currentAudio: {},
            isPlaying: false,
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null,
        };
        this.totalAudioCount = 0
    }

    permissionAllert = () => {
        Alert.alert("Izin Diperlukan", "Aplikasi ini membutuhkan izin untuk membaca file audio",
            [{
                text: 'Okay',
                onPress: () => this.getPermission()
            }
            ])
    }

    getLagu = async () => {
        const { dataProvider, audioFile } = this.state
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount
        });

        this.totalAudioCount = media.totalCount

        this.setState({
            ...this.state,
            dataProvider: dataProvider.cloneWithRows([...audioFile, ...media.assets]),
            audioFile: [...audioFile, ...media.assets]
        })
    }

    loadPrevAudio = async () => {
        let prevAudio = await AsyncStorage.getItem('prevAudio');
        let currentAudio;
        let currentAudioIndex;

        if (prevAudio === null) {
            currentAudio = this.state.audioFile[0];
            currentAudioIndex = 0;
        } else {
            prevAudio = JSON.parse(prevAudio);
            currentAudio = prevAudio.audio;
            currentAudioIndex = prevAudio.index;
        }

        this.setState({ ...this.state, currentAudio, currentAudioIndex })
    }

    getPermission = async () => {
        const permission = await MediaLibrary.getPermissionsAsync()
        if (permission.granted) {
            //get audio file
            this.getLagu()
        }

        if (!permission.canAskAgain && !permission.granted) {
            this.setState({ ...this.state, permissionError: true })
        }

        if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()
            if (status === 'denied' && canAskAgain) {
                // alert user
                this.permissionAllert()
            }
            if (status === 'granted') {
                //get audio file
                this.getLagu()
            }
            if (status === 'denied' && !canAskAgain) {
                // error msg
                this.setState({ ...this.state, permissionError: true })
            }
        }
    }

    onPlaybackStatusUpdate = async (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.updateState(this, {
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            })
        }

        if (playbackStatus.didJustFinish) {
            const nextAudioIndex = this.state.currentAudioIndex + 1;
            if (nextAudioIndex >= this.totalAudioCount) {
                this.state.playback.unloadAsync();
                this.updateState(this, {
                    sound: null,
                    currentAudio: this.state.audioFile[0],
                    isPlaying: false,
                    currentAudioIndex: 0,
                    playbackDuration: null,
                    playbackPosition: null
                });
                await storeAudioForNextOpening(this.state.audioFile[0], 0);
            }
            const audio = this.state.audioFile[nextAudioIndex];
            const status = await next(this.state.playback, audio.uri)
            this.updateState(this, {
                sound: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: nextAudioIndex
            });
            await storeAudioForNextOpening(audio, nextAudioIndex);
        }
    };

    componentDidMount() {
        this.getPermission()
        if (this.state.playback === null) {
            this.setState({ ...this.state, playback: new Audio.Sound() })
        }
    }

    updateState = (prevState, newState = {}) => {
        this.setState({ ...prevState, ...newState })
    }

    render() {
        const {
            audioFile,
            dataProvider,
            permissionError,
            playback,
            sound,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            playbackDuration
        } = this.state
        if (permissionError) return (
            <View style={styles.container}>
                <View style={styles.msgContainer}>
                    <Text style={styles.msg}>
                        Aplikasi membutuhkan izin agar dapat memutar lagu!
                    </Text>
                </View>
            </View>
        );

        return (
            <AudioContext.Provider value={{
                audioFile,
                dataProvider,
                playback,
                sound,
                currentAudio,
                isPlaying,
                currentAudioIndex,
                updateState: this.updateState,
                loadPrevAudio: this.loadPrevAudio,
                onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
                totalAudioCount: this.totalAudioCount,
                playbackPosition,
                playbackDuration
            }}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBECF0'
    },
    msgContainer: {
        padding: 20,
        width: '80%',
        elevation: 3,
        backgroundColor: 'white',
        borderRadius: 10
    },
    msg: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red'
    }
})

export default AudioProvider;