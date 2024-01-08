import { useContext } from 'react';
import { View } from 'react-native';

import { NotificationSettings } from './components/notifications-settings';

import { Typographies } from '~/shared/components/typographies';
import { SettingsContext } from '~/shared/contexts/settings-context';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function SettingsScreen() {
  const { settings, setSettings } = useContext(SettingsContext);

  const translate = useTranslate();

  return (
    <DefaultLayout>
      <View>
        <Typographies.Title1>{translate('settings.screenName')}</Typographies.Title1>

        <View>
          <Typographies.Title2>Notifications</Typographies.Title2>
          <NotificationSettings
            notificationSettings={settings.notifications}
            setNotificationSettings={(notifications) => setSettings({ ...settings, notifications })}
          />
        </View>
      </View>
    </DefaultLayout>
  );
}
