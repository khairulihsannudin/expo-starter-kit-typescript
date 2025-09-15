/**
 * Nova the Starbook - Tooth Defender Adventures
 * Expo App with React Navigation and AR capabilities
 * 
 * @format
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, Animated, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './components/HomeScreen';
import KoleksiSeriNovaScreen from './components/KoleksiSeriNovaScreen';
import ARScannerScreen from './components/not_used/ARScannerScreen2';

const robotImg = require('./assets/robot.png'); 
const loadingBg = require('./assets/loading.png'); 

// Define navigation types - improves TypeScript experience with navigation
type RootStackParamList = {
  Loading: undefined;
  Home: undefined;
  KoleksiSeriNova: undefined;
  ARScanner: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface LoadingScreenProps {
  navigation: any;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ navigation }) => {
  const [progress] = useState(new Animated.Value(0));
  const [percent, setPercent] = useState(0);
  
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    });
    animation.start();

    // Animate percent value
    const interval = setInterval(() => {
      progress.addListener(({ value }) => {
        setPercent(Math.round(value * 100));
      });
    }, 50);

    // Navigate to HomeScreen after loading
    const timeout = setTimeout(() => {
      navigation.replace('Home');
    }, 2200);

    return () => {
      progress.removeAllListeners();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigation, progress]);

  const progressInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground source={loadingBg} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="dark-content" backgroundColor="#e6f7ff" />
      <View style={styles.header}>
        <Text style={styles.title}>NOVA THE STARBOOK</Text>
        <Text style={styles.subtitle}>Tooth Defender Adventures</Text>
      </View>
      <View style={styles.robotContainer}>
        <Image source={robotImg} style={styles.robot} resizeMode="contain" />
      </View>
      <View style={styles.loadingBarContainer}>
        <Text style={styles.percentText}>{percent}%</Text>
        <View style={styles.loadingBarBg}>
          <Animated.View style={[styles.loadingBar, { width: progressInterpolate }]} />
        </View>
        <Text style={styles.loadingText}>LOADING...</Text>
      </View>
    </ImageBackground>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="KoleksiSeriNova" component={KoleksiSeriNovaScreen} />
          <Stack.Screen name="ARScanner" component={ARScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};



// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'serif',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 10,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  robotContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  robot: {
    width: 360,
    height: 360,
  },
  loadingBarContainer: {
    alignItems: 'center',
    width: '80%',
  },
  percentText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loadingBarBg: {
    width: '100%',
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffe066',
    marginBottom: 8,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#ffe066',
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default App;
