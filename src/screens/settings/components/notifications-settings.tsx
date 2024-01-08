import { View, FlatList, StyleSheet, Pressable } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
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

  const notificationEntries = Object.entries(notificationSettings);
  const notificationEntriesLength = notificationEntries.length;

  const numberOfEmptyCells = numberOfColumns - (notificationEntriesLength % numberOfColumns);
  const emptyCells = Array.from({ length: numberOfEmptyCells }).map(
    (_, i) => [`empty-${i}`, null] as const
  );

  return (
    <View style={styles.notificationGrid}>
      <FlatList
        data={[...notificationEntries, ...emptyCells]}
        renderItem={({ item: [key, value] }) => (
          <NotificationSetting
            label={key}
            value={value}
            setValue={(value) => setNotificationSettings({ ...notificationSettings, [key]: value })}
          />
        )}
        numColumns={3}
        keyExtractor={([key]) => key}
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

  if (value === null) {
    return <View style={{ flex: styles.container.flex, margin: styles.container.margin }} />;
  }

  return (
    <Pressable
      style={StyleSheet.compose(styles.container, value && styles.containerSelected)}
      onPress={() => setValue(!value)}>
      <Typographies.Body>{label}</Typographies.Body>
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
}));
