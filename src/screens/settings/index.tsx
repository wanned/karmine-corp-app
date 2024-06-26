import { useContext } from 'react';
import { View } from 'react-native';

import { LanguageSettings } from './components/language-settings';
import { NotificationSettings } from './components/notifications-settings';
import { OtherSettings } from './components/other-settings';
import { SpoilerSettings } from './components/spoiler-settings';

import packageJson from '~/../package.json';
import { Typographies } from '~/shared/components/typographies';
import { SettingsContext } from '~/shared/contexts/settings-context';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export default function SettingsScreen() {
  const { settings, setSettings } = useContext(SettingsContext);

  const styles = useStyles(getStyles);
  const translate = useTranslate();

  return (
    <DefaultLayout>
      <View>
        <View style={styles.titleContainer}>
          <Typographies.Title1>{translate('settings.screenName')}</Typographies.Title1>
        </View>

        <View style={styles.settingsContainer}>
          <View>
            <Typographies.Title2>{translate('settings.notifications.title')}</Typographies.Title2>
            <View style={styles.sectionDescriptionContainer}>
              <Typographies.Body>
                {translate('settings.notifications.description')}
              </Typographies.Body>
            </View>
            <NotificationSettings
              notificationSettings={settings.notifications}
              setNotificationSettings={(notifications) =>
                setSettings({ ...settings, notifications })
              }
            />
          </View>

          <View>
            <Typographies.Title2>{translate('settings.spoiler.title')}</Typographies.Title2>
            <SpoilerSettings
              showResultsSettings={settings.showResults}
              setShowResultsSettings={(showResults) => setSettings({ ...settings, showResults })}
            />
          </View>

          <View>
            <Typographies.Title2>{translate('settings.language.title')}</Typographies.Title2>
            <View style={styles.sectionDescriptionContainer}>
              <Typographies.Body>{translate('settings.language.description')}</Typographies.Body>
            </View>
            <LanguageSettings
              languageSettings={settings.language}
              setLanguageSettings={(language) => setSettings({ ...settings, language })}
            />
          </View>

          <View>
            <Typographies.Title2>{translate('settings.other.title')}</Typographies.Title2>
            <OtherSettings />
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Typographies.Label color={styles.versionContainer.color}>
            {translate('settings.version')} {packageJson.version}
          </Typographies.Label>

          <Typographies.Label color={styles.versionContainer.color}>
            {translate('settings.notAffiliated')}
          </Typographies.Label>
        </View>
      </View>
    </DefaultLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  titleContainer: {
    marginBottom: 12,
  },
  sectionDescriptionContainer: {
    opacity: theme.opacities.priority2,
    marginBottom: 12,
  },
  settingsContainer: {
    flexDirection: 'column',
    gap: 24,
  },
  versionContainer: {
    marginTop: 48,
    marginBottom: 32,
    alignItems: 'center',
    color: theme.colors.subtleForeground,
  },
}));
