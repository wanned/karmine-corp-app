import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { RootStackParamList } from '.';
import { Typographies } from '../components/typographies';
import { useStyles } from '../hooks/use-styles';
import { useTranslate } from '../hooks/use-translate';
import { createStylesheet } from '../styles/create-stylesheet';
import { assertUnreachable } from '../utils/assert-unreachable';

export function TabBar() {
  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();
  const styles = useStyles(getStyles);

  return (
    <View
      style={styles.tabBar}
      pointerEvents="box-none"
      accessibilityRole="tablist"
      accessibilityLabel="Bottom tab bar">
      <TabBarButton navigation={navigation} name="home" />
      <TabBarButton navigation={navigation} name="calendar" />
      <TabBarButton navigation={navigation} name="teams" />
      <TabBarButton navigation={navigation} name="settings" />
    </View>
  );
}

function TabBarButton({
  navigation,
  name,
}: {
  navigation: NavigationContainerRef<RootStackParamList>;
  name: keyof RootStackParamList;
}) {
  const [isActive, setIsActive] = useState(navigation.getCurrentRoute()?.name === name);
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setIsActive(navigation.getCurrentRoute()?.name === name);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Pressable
      onPress={() => navigation.navigate(name)}
      style={{
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TabBarIcon name={name} isActive={isActive} />
      <Typographies.Body
        color={isActive ? styles.tabBarButtonActive.color : styles.tabBarButtonInactive.color}>
        {translate(`${name}.screenName`)}
      </Typographies.Body>
    </Pressable>
  );
}

function TabBarIcon({ name, isActive }: { name: keyof RootStackParamList; isActive: boolean }) {
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
    height: 80,
    borderTopWidth: 1,
    borderTopColor: theme.colors.subtleBackground,
  },
  tabBarButtonActive: {
    color: theme.colors.foreground,
  },
  tabBarButtonInactive: {
    color: theme.colors.subtleForeground,
  },
}));
