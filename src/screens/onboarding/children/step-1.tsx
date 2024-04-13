import { useContext } from 'react';

import { NotificationSettings } from '~/screens/settings/components/notifications-settings';
import { SettingsContext } from '~/shared/contexts/settings-context';

export const Step1 = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    <NotificationSettings
      notificationSettings={settings.notifications}
      setNotificationSettings={(notifications) => setSettings({ ...settings, notifications })}
    />
  );
};
