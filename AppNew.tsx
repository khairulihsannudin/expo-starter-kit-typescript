/**
 * Nova the Starbook - Tooth Defender Adventures
 * Expo App with React Navigation and AR capabilities
 * 
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './components/HomeScreen';
import KoleksiSeriNovaScreen from './components/KoleksiSeriNovaScreen';
import ARScannerScreen from './components/ARScannerScreen';

// Define navigation types - improves TypeScript experience with navigation
type RootStackParamList = {
  Home: undefined;
  KoleksiSeriNova: undefined;
  ARScanner: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="KoleksiSeriNova" component={KoleksiSeriNovaScreen} />
          <Stack.Screen name="ARScanner" component={ARScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
