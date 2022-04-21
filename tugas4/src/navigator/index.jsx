import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ListLagu from '../screens/lagu';
import Player from '../screens/player';
import PlayList from '../screens/playlist';

const tab = createBottomTabNavigator();

const Navigator = () => {
    return (
        <tab.Navigator
            initialRouteName='Lagu'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    let routeName = route.name;

                    if (routeName === 'Lagu') {
                        iconName = focused ? 'musical-notes-sharp' : 'musical-notes-outline'
                    } else if (routeName === 'Player') {
                        iconName = focused ? 'play-circle' : 'play-circle-outline'
                    } else if (routeName === 'Playlist') {
                        iconName = focused ? 'md-file-tray-full' : 'md-file-tray-full-outline'
                    }

                    return <Ionicons name={iconName} size={24} color={color} />
                },
                tabBarLabelStyle: {
                    paddingBottom: 5,
                    fontSize: 12,
                },
                tabBarStyle: {
                    padding: 5,
                    height: 55,

                },
                tabBarActiveTintColor: '#c9aa88',
                tabBarInactiveTintColor: '#949494',
            })}
        >
            <tab.Screen name='Lagu' component={ListLagu} options={{ headerShown: false }} />
            <tab.Screen name='Player' component={Player} options={{ headerShown: false }} />
            <tab.Screen name='Playlist' component={PlayList} options={{ headerShown: false }} />
        </tab.Navigator>
    );
};

export default Navigator;