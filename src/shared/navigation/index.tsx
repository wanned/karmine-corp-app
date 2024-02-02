import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabBar } from './tab-bar';
import { CoreData } from '../data/core/types';

import CalendarScreen from '~/screens/calendar';
import { GameDetailsModal } from '~/screens/game-details-modal';
import HomeScreen from '~/screens/home';
import { LastResultsModal } from '~/screens/home/modals/last-results-modal';
import { NextMatchesModal } from '~/screens/home/modals/next-matches-modal';
import { StepOne } from '~/screens/onboarding/step-one';
import SettingsScreen from '~/screens/settings';
import TeamsScreen from '~/screens/teams';

const RootNavigator = ModalsNavigator;
export default RootNavigator;

export type PagesParamList = {
  onboarding: undefined;
  home: undefined;
  calendar: undefined;
  teams: undefined;
  settings: undefined;
};

export type ModalsParamList = {
  root: undefined;
  nextMatchesModal: undefined;
  lastResultsModal: undefined;
  gameDetailsModal: {
    match: CoreData.Match;
    gamesComponent: (props: { match: CoreData.Match }) => React.ReactNode;
  };
};

const Modals = createNativeStackNavigator<ModalsParamList>();
const Pages = createBottomTabNavigator<PagesParamList>();

function ModalsNavigator() {
  return (
    <NavigationContainer>
      <Modals.Navigator
        initialRouteName="root"
        screenOptions={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}>
        <Modals.Screen name="root" component={PagesNavigator} options={{ headerShown: false }} />
        <Modals.Screen name="nextMatchesModal" component={NextMatchesModal} />
        <Modals.Screen name="lastResultsModal" component={LastResultsModal} />
        <Modals.Screen name="gameDetailsModal" component={GameDetailsModal} />
      </Modals.Navigator>
    </NavigationContainer>
  );
}

function PagesNavigator() {
  return (
    <Pages.Navigator
      initialRouteName="onboarding"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}>
      <Pages.Screen name="onboarding" component={StepOne} />
      <Pages.Screen name="home" component={HomeScreen} />
      <Pages.Screen name="calendar" component={CalendarScreen} />
      <Pages.Screen name="teams" component={TeamsScreen} />
      <Pages.Screen name="settings" component={SettingsScreen} />
    </Pages.Navigator>
  );
}
