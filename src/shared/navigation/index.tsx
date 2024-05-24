import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef } from 'react';
import { InteractionManager } from 'react-native';

import { TabBar } from './tab-bar';
import { useInitialModalRoute } from './use-initial-route';
import { RootParamList } from '../hooks/use-navigation';
import { useSplashScreen } from '../hooks/use-splash-screen';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import CalendarScreen from '~/screens/calendar';
import CreditsScreen from '~/screens/credits';
import { GameDetailsModal } from '~/screens/game-details-modal';
import HomeScreen from '~/screens/home';
import { LastResultsModal } from '~/screens/home/modals/last-results-modal';
import { NextMatchesModal } from '~/screens/home/modals/next-matches-modal';
import { OnboardingModal } from '~/screens/onboarding/modals/onboarding-modal';
import SettingsScreen from '~/screens/settings';
import TeamsScreen from '~/screens/teams';

export type PagesParamList = {
  home: undefined;
  calendar: undefined;
  teams: undefined;
  settings: undefined;
};

export type ModalsParamList = {
  root: undefined;
  nextMatchesModal: undefined;
  lastResultsModal: undefined;
  onboardingModal: undefined;
  gameDetailsModal: {
    match: CoreData.Match;
  };
  credits: undefined;
};

const Modals = createNativeStackNavigator<ModalsParamList>();
const Pages = createBottomTabNavigator<PagesParamList>();

const RootNavigator = () => {
  const { createHideSplashScreen } = useSplashScreen();
  const hideSplashScreen = useMemo(() => createHideSplashScreen(), []);
  const navigationRef = useRef<NavigationContainerRef<RootParamList> | null>(null);

  const isFirstLaunch = useAsyncStorage('isFirstLaunch');

  useEffect(() => {
    const navigation = navigationRef.current;

    if (!navigation) return;

    // If you want to test in development, replace `isFirstLaunch.getItem()` with `new Promise((resolve) => resolve(null))`
    isFirstLaunch.getItem().then(async (value) => {
      await isFirstLaunch.setItem('false');

      if (value === null) {
        navigation.navigate('onboardingModal');
      }

      InteractionManager.runAfterInteractions(() => {
        hideSplashScreen();
      });
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <ModalsNavigator />
    </NavigationContainer>
  );
};

function ModalsNavigator() {
  const { initialRouteName, initialParams, loaded } = useInitialModalRoute();

  if (!loaded) return null;

  return (
    <Modals.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        presentation: 'fullScreenModal',
      }}>
      <Modals.Screen
        name="root"
        component={PagesNavigator}
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <Modals.Screen name="nextMatchesModal" component={NextMatchesModal} />
      <Modals.Screen name="lastResultsModal" component={LastResultsModal} />
      <Modals.Screen
        name="gameDetailsModal"
        component={GameDetailsModal}
        initialParams={initialParams?.gameDetailsModal}
      />
      <Modals.Screen
        name="onboardingModal"
        component={OnboardingModal}
        options={{
          animation: 'none',
        }}
      />
      <Modals.Screen name="credits" component={CreditsScreen} />
    </Modals.Navigator>
  );
}

function PagesNavigator() {
  return (
    <Pages.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}>
      <Pages.Screen name="home" component={HomeScreen} />
      <Pages.Screen name="calendar" component={CalendarScreen} />
      <Pages.Screen name="teams" component={TeamsScreen} />
      <Pages.Screen name="settings" component={SettingsScreen} />
    </Pages.Navigator>
  );
}

export default RootNavigator;
