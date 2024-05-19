import 'react-native-gesture-handler';
import './global';

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { registerRootComponent } from 'expo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { useLeaderboards } from './lib/karmine-corp-api/adapters/react-native/use-leaderboards';
import { useTeams } from './lib/karmine-corp-api/adapters/react-native/use-teams';
import { useMatches } from './shared/hooks/data/use-matches';
import { useSplashScreen } from './shared/hooks/use-splash-screen';
import { useTheme } from './shared/hooks/use-theme';
import RootNavigator from './shared/navigation';
import {
  addBackgroundNotificationHandlers,
  addForegroundNotificationHandlers,
} from './shared/notifications/add-notification-handlers';
import { requestNotificationPermission } from './shared/notifications/request-permission';
import { subscribeToTopic } from './shared/notifications/subscribe-to-topic';
import { reactQueryStoragePersister } from './shared/utils/react-query-storage-persister';

import { SettingsProvider } from '~/shared/contexts/settings-context';
import { ThemeContext } from '~/shared/contexts/theme-context';
import { styleTokens } from '~/shared/styles/tokens';

addBackgroundNotificationHandlers();

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
});

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

  const { createHideSplashScreen } = useSplashScreen();
  const hideSplashScreenWhenFontsLoaded = useMemo(() => createHideSplashScreen(), []);
  const hideSplashScreenOnRootViewLayout = useMemo(() => createHideSplashScreen(), []);

  useEffect(() => {
    if (fontsLoaded) {
      hideSplashScreenWhenFontsLoaded();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    requestNotificationPermission();
    subscribeToTopic();
    addForegroundNotificationHandlers();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  // TODO: Correctly implement and type SettingsContext
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: reactQueryStoragePersister, maxAge: Infinity }}>
      <SettingsProvider value={{} as any}>
        <ThemeContext.Provider
          value={{
            theme: styleTokens,
          }}>
          <_App onLayoutRootView={() => hideSplashScreenOnRootViewLayout()} />
        </ThemeContext.Provider>
      </SettingsProvider>
    </PersistQueryClientProvider>
  );
}

const _App = ({ onLayoutRootView }: { onLayoutRootView: () => void }) => {
  const theme = useTheme();

  useTeams(); // Ensure teams are loaded on app start
  useLeaderboards(); // Ensure leaderboards are loaded on app start
  useMatches(); // Ensure matches are loaded on app start

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }} onLayout={onLayoutRootView}>
      <RootNavigator />
    </View>
  );
};

registerRootComponent(App);
