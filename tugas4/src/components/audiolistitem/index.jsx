import React, { useState } from 'react';
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const convertDuration = minutes => {
    if (minutes) {
        const hrs = minutes / 60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100);

        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }

        if (sec < 10) {
            return `${minute}:0${sec}`;
        }

        return `${minute}:${sec}`;
    }
};

const playPauseIcon = isPlaying => {
    if (isPlaying)
        return (
            <FontAwesome5 name="play" size={10} color="#b6b8b9" />
        );
    return <FontAwesome5 name="pause" size={10} color="#b6b8b9" />;
}

const AudioListItem = ({ title, duration, optionPress, audioPress, isPlaying, activeListItem }) => {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.songContainer}>
                    <Pressable style={{ width: '90%' }} onPress={audioPress}>
                        <View style={styles.leftContainer}>
                            <Text numberOfLines={1} style={[styles.songTitle, { color: activeListItem ? '#c9aa88' : 'black' }]}>{title}</Text>
                            <View style={styles.songDurationContainer}>
                                <Text style={styles.songDuration}>{convertDuration(duration)}</Text>
                                <Text>
                                    {activeListItem ? playPauseIcon(isPlaying) : ''}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                    <View style={styles.rightContainer}>
                        <Entypo
                            onPress={optionPress}
                            name="dots-three-vertical"
                            size={20}
                            color="black"
                            style={{ padding: 5 }}
                        />
                    </View>
                </View>
                <View style={styles.separator} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    songContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    songTitle: {
        fontSize: 16,
    },
    songDurationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    songDuration: {
        fontSize: 14,
        color: '#b6b8b9',
        marginRight: 5
    },
    leftContainer: {
        width: '90%',
        paddingTop: 10,
        paddingBottom: 5,
        flexDirection: 'column',
    },
    rightContainer: {
        justifyContent: 'center',
    },
    separator: {
        width: '100%',
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10
    }
})

export default AudioListItem;