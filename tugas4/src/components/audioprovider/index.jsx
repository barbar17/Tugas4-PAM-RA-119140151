import React, { Component, createContext } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview'

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
        }
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

        this.setState({
            ...this.state,
            dataProvider: dataProvider.cloneWithRows([...audioFile, ...media.assets]),
            audioFile: [...audioFile, ...media.assets]
        })
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

    componentDidMount() {
        this.getPermission()
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
            currentAudioIndex
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
                updateState: this.updateState
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