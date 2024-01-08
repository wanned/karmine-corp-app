import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { Pressable, StyleSheet, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { RootStackParamList } from '.';
import home from '../../screens/calendar';
import calendar from '../../screens/home';
import settings from '../../screens/settings';
import teams from '../../screens/teams';
// import { KarmineLogo } from '../components/logos/karmine-logo';
import { Typographies } from '../components/typographies';
import { createStylesheet } from '../styles/create-stylesheet';
import { styleTokens } from '../styles/tokens';

const Tab = createBottomTabNavigator();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={styles.tabBarIcon} {...props} />;
}

type TabLayoutProps = StackScreenProps<RootStackParamList>;

export default function TabLayout({ navigation }: TabLayoutProps) {
  const styles = getStyles(styleTokens);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: styles.active.color,
        tabBarInactiveTintColor: styles.inactive.color,
        tabBarStyle: styles.tabBar,
        tabBarLabel: ({ children, focused }) => (
          <View>
            <Typographies.Body color={focused ? styles.active.color : styles.inactive.color}>
              {children}
            </Typographies.Body>
          </View>
        ),
        header: () => (
          <View style={styles.header}>
            {/* <KarmineLogo color={styles.active.color} width={38} height={36} /> */}
          </View>
        ),
      }}>
      <Tab.Screen
        name="Home"
        component={home}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Iconify icon="solar:home-2-bold" size={24} color={styles.active.color} />
            ) : (
              <Iconify icon="solar:home-2-linear" size={24} color={styles.inactive.color} />
            ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={calendar}
        options={{
          title: 'Calendrier',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Iconify
                icon="solar:calendar-minimalistic-bold-duotone"
                size={24}
                color={styles.active.color}
              />
            ) : (
              <Iconify
                icon="solar:calendar-minimalistic-linear"
                size={24}
                color={styles.inactive.color}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Teams"
        component={teams}
        options={{
          title: 'Équipes',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Iconify
                icon="solar:users-group-rounded-bold"
                size={24}
                color={styles.active.color}
              />
            ) : (
              <Iconify
                icon="solar:users-group-rounded-linear"
                size={24}
                color={styles.inactive.color}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={settings}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Iconify icon="solar:settings-bold" size={24} color={styles.active.color} />
            ) : (
              <Iconify icon="solar:settings-linear" size={24} color={styles.inactive.color} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const getStyles = createStylesheet((theme) => ({
  tabBar: {
    backgroundColor: theme.colors.background,
    display: 'flex',
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingBottom: 10,
  },
  inactive: {
    color: theme.colors.subtleForeground,
  },
  active: {
    color: theme.colors.foreground,
  },
  header: {
    backgroundColor: theme.colors.background,
  },
}));
