import React from 'react';
import { View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const PlayerButton = ({ onPress, iconType, size = 40, color = '#303d49', otherProps }) => {
    const getIconName = (name) => {
        switch (type) {
            case 'PLAY':
                return 'pausecircle';
            case 'PAUSE':
                return 'play';
            case 'NEXT':
                return 'stepforward';
            case 'PREV':
                return 'stepbackward';
        }
    };
    return (
        <AntDesign onPress={onPress} name={getIconName(iconType)} size={size} color={color} {...otherProps} />
    );
};

export default PlayerButton;