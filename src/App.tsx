import 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerRootComponent } from 'expo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';

import { useInitMatchesResults } from './shared/hooks/data/use-matches-results';
import { useInitNextMatches } from './shared/hooks/data/use-next-matches';
import { useTheme } from './shared/hooks/use-theme';
import RootNavigator from './shared/navigation';

import { SettingsProvider } from '~/shared/contexts/settings-context';
import { ThemeContext } from '~/shared/contexts/theme-context';
import { styleTokens } from '~/shared/styles/tokens';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    // Cairo
    'Cairo-Black': require('../assets/fonts/Cairo/Cairo-Black.ttf'),
    'Cairo-Bold': require('../assets/fonts/Cairo/Cairo-Bold.ttf'),
    'Cairo-ExtraBold': require('../assets/fonts/Cairo/Cairo-ExtraBold.ttf'),
    'Cairo-Medium': require('../assets/fonts/Cairo/Cairo-Medium.ttf'),
    'Cairo-Regular': require('../assets/fonts/Cairo/Cairo-Regular.ttf'),
    'Cairo-SemiBold': require('../assets/fonts/Cairo/Cairo-SemiBold.ttf'),
    // MonaspaceNeon
    'MonaspaceNeon-Bold': require('../assets/fonts/MonaspaceNeon/MonaspaceNeon-Bold.otf'),
    'MonaspaceNeon-ExtraLight': require('../assets/fonts/MonaspaceNeon/MonaspaceNeon-ExtraLight.otf'),
    'MonaspaceNeon-Light': require('../assets/fonts/MonaspaceNeon/MonaspaceNeon-Light.otf'),
    'MonaspaceNeon-Medium': require('../assets/fonts/MonaspaceNeon/MonaspaceNeon-Medium.otf'),
    'MonaspaceNeon-Regular': require('../assets/fonts/MonaspaceNeon/MonaspaceNeon-Regular.otf'),
    'MonaspaceNeon-SemiBold': require('../assets/fonts/MonaspaceNeon/MonaspaceNeon-SemiBold.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // TODO: Correctly implement and type SettingsContext
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider value={{} as any}>
        <ThemeContext.Provider
          value={{
            theme: styleTokens,
          }}>
          <_App onLayoutRootView={onLayoutRootView} />
        </ThemeContext.Provider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

const _App = ({ onLayoutRootView }: { onLayoutRootView: () => void }) => {
  const theme = useTheme();

  useInitNextMatches();
  useInitMatchesResults();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }} onLayout={onLayoutRootView}>
      <RootNavigator />
    </View>
  );
};

registerRootComponent(App);
