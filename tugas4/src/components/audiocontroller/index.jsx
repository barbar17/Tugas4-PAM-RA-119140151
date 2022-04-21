export const play = async (playback, uri) => {
    try {
        return await playback.loadAsync(
            { uri },
            { shouldPlay: true }
        );
    } catch (error) {
        console.log('error inside play helper method', error.message)
    }
}

export const pause = async (playback) => {
    try {
        return await playback.setStatusAsync(
            { shouldPlay: false }
        );
    } catch (error) {
        console.log('error inside pause helper method', error.message)
    }
}

export const resume = async (playback) => {
    try {
        return await playback.playAsync();
    } catch (error) {
        console.log('error inside resume helper method', error.message)
    }
}

export const next = async (playback, uri) => {
    try {
        await playback.stopAsync()
        await playback.unloadAsync()
        return await play(playback, uri)
    } catch (error) {
        console.log('error inside next helper method', error.message)
    }
}