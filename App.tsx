import 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';

import RootStack from './src/shared/navigation';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    // Cairo
    'Cairo-Black': require('./assets/fonts/Cairo/Cairo-Black.ttf'),
    'Cairo-Bold': require('./assets/fonts/Cairo/Cairo-Bold.ttf'),
    'Cairo-ExtraBold': require('./assets/fonts/Cairo/Cairo-ExtraBold.ttf'),
    'Cairo-Light': require('./assets/fonts/Cairo/Cairo-Light.ttf'),
    'Cairo-Medium': require('./assets/fonts/Cairo/Cairo-Medium.ttf'),
    'Cairo-Regular': require('./assets/fonts/Cairo/Cairo-Regular.ttf'),
    'Cairo-SemiBold': require('./assets/fonts/Cairo/Cairo-SemiBold.ttf'),
    // MonaspaceNeon
    'MonaspaceNeon-Bold': require('./assets/fonts/MonaspaceNeon/MonaspaceNeon-Bold.otf'),
    'MonaspaceNeon-ExtraBold': require('./assets/fonts/MonaspaceNeon/MonaspaceNeon-ExtraBold.otf'),
    'MonaspaceNeon-ExtraLight': require('./assets/fonts/MonaspaceNeon/MonaspaceNeon-ExtraLight.otf'),
    'MonaspaceNeon-Light': require('./assets/fonts/MonaspaceNeon/MonaspaceNeon-Light.otf'),
    'MonaspaceNeon-Medium': require('./assets/fonts/MonaspaceNeon/MonaspaceNeon-Medium.otf'),
    'MonaspaceNeon-Regular': require('./assets/fonts/MonaspaceNeon/MonaspaceNeon-Regular.otf'),
    'MonaspaceNeon-SemiBold': require('./assets/fonts/MonaspaceNeon/MonaspaceNeon-SemiBold.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <RootStack />
    </View>
  );
}
