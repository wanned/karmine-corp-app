import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabBar } from './tab-bar';

import CalendarScreen from '~/screens/calendar';
import HomeScreen from '~/screens/home';
import SettingsScreen from '~/screens/settings';
import TeamsScreen from '~/screens/teams';

export type RootStackParamList = {
  Home: undefined;
  Calendar: undefined;
  Teams: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Teams" component={TeamsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <TabBar />
    </NavigationContainer>
  );
}
