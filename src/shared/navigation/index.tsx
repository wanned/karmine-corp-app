import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabBar } from './tab-bar';

import CalendarScreen from '~/screens/calendar';
import HomeScreen from '~/screens/home';
import SettingsScreen from '~/screens/settings';
import TeamsScreen from '~/screens/teams';

export type RootStackParamList = {
  home: undefined;
  calendar: undefined;
  teams: undefined;
  settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="calendar" component={CalendarScreen} />
        <Stack.Screen name="teams" component={TeamsScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
      </Stack.Navigator>
      <TabBar />
    </NavigationContainer>
  );
}
