import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PagesParamList } from '.';
import { Typographies } from '../components/typographies';
import { useStyles } from '../hooks/use-styles';
import { useTranslate } from '../hooks/use-translate';
import { createStylesheet } from '../styles/create-stylesheet';
import { assertUnreachable } from '../utils/assert-unreachable';

export function TabBar({ navigation, state }: BottomTabBarProps) {
  const styles = useStyles(getStyles);
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: safeAreaInsets.bottom || undefined,
        },
      ]}
      pointerEvents="box-none"
      accessibilityRole="tablist"
      accessibilityLabel="Bottom tab bar">
      <TabBarButton navigation={navigation} state={state} name="home" />
      <TabBarButton navigation={navigation} state={state} name="calendar" />
      <TabBarButton navigation={navigation} state={state} name="teams" />
      <TabBarButton navigation={navigation} state={state} name="settings" />
    </View>
  );
}

function TabBarButton({
  navigation,
  state,
  name,
}: {
  navigation: BottomTabBarProps['navigation'];
  state: BottomTabBarProps['state'];
  name: keyof PagesParamList;
}) {
  const currentRoute = state.routes[state.index];
  const isActive = currentRoute?.name === name;
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  return (
    <Pressable onPress={() => navigation.navigate(name)} style={styles.tabBarButton}>
      <TabBarIcon name={name} isActive={isActive} />
      <Typographies.Body
        color={isActive ? styles.tabBarButtonActive.color : styles.tabBarButtonInactive.color}>
        {translate(`${name}.screenName`)}
      </Typographies.Body>
    </Pressable>
  );
}

function TabBarIcon({ name, isActive }: { name: keyof PagesParamList; isActive: boolean }) {
  const styles = useStyles(getStyles);

  const iconProps = {
    size: 24,
    color: isActive ? styles.tabBarButtonActive.color : styles.tabBarButtonInactive.color,
  };

  switch (name) {
    case 'home': {
      if (isActive) {
        return <Iconify icon="solar:home-2-bold" {...iconProps} />;
      } else {
        return <Iconify icon="solar:home-2-linear" {...iconProps} />;
      }
    }
    case 'calendar': {
      if (isActive) {
        return <Iconify icon="solar:calendar-minimalistic-bold" {...iconProps} />;
      } else {
        return <Iconify icon="solar:calendar-minimalistic-linear" {...iconProps} />;
      }
    }
    case 'teams': {
      if (isActive) {
        return <Iconify icon="solar:users-group-rounded-bold" {...iconProps} />;
      } else {
        return <Iconify icon="solar:users-group-rounded-linear" {...iconProps} />;
      }
    }
    case 'settings': {
      if (isActive) {
        return <Iconify icon="solar:settings-bold" {...iconProps} />;
      } else {
        return <Iconify icon="solar:settings-linear" {...iconProps} />;
      }
    }
  }

  // `assertUnreachable` is a helper function that ensures that the above switch statement is exhaustive.
  assertUnreachable(name);
}

const getStyles = createStylesheet((theme) => ({
  tabBar: {
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: theme.spacing.xlarge,
    borderTopWidth: 1,
    borderTopColor: theme.colors.subtleBackground,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarButtonActive: {
    color: theme.colors.foreground,
  },
  tabBarButtonInactive: {
    color: theme.colors.subtleForeground,
  },
}));
