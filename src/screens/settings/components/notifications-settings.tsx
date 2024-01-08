import { Switch, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { Settings } from '~/shared/types/Settings';

export function NotificationSettings({
  notificationSettings,
  setNotificationSettings,
}: {
  notificationSettings: Settings['notifications'];
  setNotificationSettings: (notificationSettings: Settings['notifications']) => void;
}) {
  return (
    <View>
      {Object.entries(notificationSettings).map(([key, value]) => (
        <NotificationSetting
          key={key}
          label={key}
          value={value}
          setValue={(value) => setNotificationSettings({ ...notificationSettings, [key]: value })}
        />
      ))}
    </View>
  );
}

function NotificationSetting({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
}) {
  return (
    <View>
      <Typographies.Body>{label}</Typographies.Body>
      <Switch value={value} onValueChange={setValue} />
    </View>
  );
}
