import { Image } from 'expo-image';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';

import { useGameLogoImage } from '../hooks/use-game-logo-image';
import { useGames } from '../hooks/use-games';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { Settings } from '~/shared/types/Settings';

const numberOfColumns = 3;
const gridGap = 16;

export function NotificationSettings({
  notificationSettings,
  setNotificationSettings,
}: {
  notificationSettings: Settings['notifications'];
  setNotificationSettings: (notificationSettings: Settings['notifications']) => void;
}) {
  const styles = useStyles(getNotificationSettingsStyles);

  const games = useGames();

  const numberOfEmptyCells =
    games.length % numberOfColumns === 0 ? 0 : numberOfColumns - (games.length % numberOfColumns);
  const emptyCells = Array.from({ length: numberOfEmptyCells }).map(
    (_, i) => `empty-${i}` as const
  );

  return (
    <View style={styles.notificationGrid}>
      <FlatList
        data={[...games, ...emptyCells]}
        scrollEnabled={false}
        renderItem={({ item: label }) => (
          <NotificationSetting
            label={label}
            value={
              label.startsWith('empty-')
                ? null
                : notificationSettings[label as KarmineApi.CompetitionName]
            }
            setValue={(value) =>
              setNotificationSettings({ ...notificationSettings, [label]: value })
            }
          />
        )}
        numColumns={3}
        keyExtractor={(key) => key}
      />
    </View>
  );
}

function NotificationSetting({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean | null;
  setValue: (value: boolean) => void;
}) {
  const styles = useStyles(getNotificationSettingStyles);

  const image = useGameLogoImage(label);

  if (value === null) {
    return <View style={{ flex: styles.container.flex, margin: styles.container.margin }} />;
  }

  return (
    <Pressable
      style={StyleSheet.compose(styles.container, value && styles.containerSelected)}
      onPress={() => setValue(!value)}>
      <Image style={styles.gameLogo} source={image} cachePolicy="memory-disk" />
    </Pressable>
  );
}

const getNotificationSettingsStyles = createStylesheet((theme) => ({
  notificationGrid: {
    margin: -gridGap / 2,
  },
}));

const getNotificationSettingStyles = createStylesheet((theme) => ({
  container: {
    aspectRatio: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: gridGap / 2,
    backgroundColor: theme.colors.subtleBackground,
    borderWidth: 2,
    borderColor: theme.colors.subtleBackground,
    borderRadius: 16,
  },
  containerSelected: {
    borderColor: theme.colors.accent,
  },
  gameLogo: {
    width: '100%',
    height: '100%',
    contentFit: 'contain',
  },
}));
