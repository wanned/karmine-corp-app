import defu from 'defu';
import * as Localization from 'expo-localization';
import { createContext, useState, useCallback, useEffect } from 'react';

import { Settings } from '../types/Settings';
import { getSettings, saveSettings } from '../utils/settings';

interface SettingsContextValue {
  settings: Settings;
  setSettings: (settings: SettingsContextValue['settings']) => void;
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: {} as SettingsContextValue['settings'],
  setSettings: () => {},
});

export const SettingsProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: Settings;
}) => {
  const [settings, _setSettings] = useState<Settings>({
    language: Localization.getLocales()[0].languageCode,
  } as Settings);

  useEffect(() => {
    getSettings().then((settings) => {
      _setSettings(defu<Settings, Settings[]>(value, settings));
    });
  }, []);

  const setSettings = useCallback(
    async (settings: Settings) => {
      await saveSettings(settings);
      _setSettings(settings);
    },
    [_setSettings]
  );

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
