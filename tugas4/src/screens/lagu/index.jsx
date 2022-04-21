import React, { Component } from "react";
import { Dimensions } from "react-native";
import { AudioContext } from "../../components/audioprovider";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import { Audio } from "expo-av";
import AudioListItem from "../../components/audiolistitem";
import Screen from "../../components/screen";
import OptionModal from "../../components/optionmodal";
import { next, pause, play, resume } from "../../components/audiocontroller";

const cleanTitle = title => {
    return title.replace(/\.[^/.]+$/, "")
}

export class ListLagu extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props);
        this.state = {
            optionModalVisible: false,
        }
        this.currentItem = {}
    }

    layoutProvider = new LayoutProvider(
        i => 'audio',
        (type, dim) => {
            switch (type) {
                case 'audio':
                    dim.width = Dimensions.get('window').width;
                    dim.height = 70;
                    break;
                default:
                    dim.width = 0;
                    dim.height = 0;
            }
        }
    );

    handleAudioPress = async audio => {
        const { sound, playback, currentAudio, updateState, audioFile } = this.context;

        if (sound === null) {
            const playback = new Audio.Sound();
            const status = await play(playback, audio.uri);
            const index = audioFile.indexOf(audio)
            return updateState(this.context, {
                currentAudio: audio,
                playback: playback,
                sound: status,
                isPlaying: true,
                currentAudioIndex: index
            })
        }

        if (sound.isLoaded && sound.isPlaying && currentAudio.id === audio.id) {
            const status = await pause(playback)
            return updateState(this.context, {
                sound: status,
                isPlaying: false
            })
        }

        if (sound.isLoaded && !sound.isPlaying && currentAudio.id === audio.id) {
            const status = await resume(playback)
            return updateState(this.context, {
                sound: status,
                isPlaying: true
            })
        }

        if (sound.isLoaded && currentAudio.id !== audio.id) {
            const status = await next(playback, audio.uri)
            const index = audioFile.indexOf(audio)
            return updateState(this.context, {
                currentAudio: audio,
                sound: status,
                isPlaying: true,
                currentAudioIndex: index
            })
        }
    }

    rowRenderer = (type, item, index, extendedState) => {
        return (
            <AudioListItem
                title={cleanTitle(item.filename)}
                isPlaying={extendedState.isPlaying}
                activeListItem={this.context.currentAudioIndex === index}
                duration={item.duration}
                audioPress={() => this.handleAudioPress(item)}
                optionPress={() => {
                    this.currentItem = cleanTitle(item.filename);
                    this.setState({ ...this.state, optionModalVisible: true })
                }}
            />
        )
    }

    render() {
        return (
            <AudioContext.Consumer>
                {({ dataProvider, isPlaying }) => {
                    return (
                        <Screen>
                            <RecyclerListView
                                dataProvider={dataProvider}
                                layoutProvider={this.layoutProvider}
                                rowRenderer={this.rowRenderer}
                                extendedState={{ isPlaying }}
                            />
                            <OptionModal
                                currentItem={this.currentItem}
                                closeModal={() => this.setState({ ...this.state, optionModalVisible: false })}
                                visible={this.state.optionModalVisible}
                                playPress={() => console.log("play")}
                                playListPress={() => console.log("playlist")}
                            />
                        </Screen>
                    )
                }}
            </AudioContext.Consumer>
        );
    };
};

export default ListLagu;