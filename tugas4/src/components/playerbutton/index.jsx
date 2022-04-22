import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

const PlayerButton = (props) => {
    const {
        onPress,
        iconType,
        size = 35,
        color = '#303d49',
    } = props;

    const getIconName = (type) => {
        switch (type) {
            case 'PLAY':
                return 'pause';
            case 'PAUSE':
                return 'play';
            case 'NEXT':
                return 'step-forward';
            case 'PREV':
                return 'step-backward';
        }
    };
    return (
        <FontAwesome5
            {...props}
            onPress={onPress}
            name={getIconName(iconType)}
            size={size}
            color={color}
        />
    );
};

export default PlayerButton;