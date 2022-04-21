import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/navigator';
import AudioProvider from './src/components/audioprovider';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <StatusBar style='dark-content' />
        <Navigator />
      </NavigationContainer>
    </AudioProvider>
  );
}

