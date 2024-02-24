import defu from 'defu';
import * as Localization from 'expo-localization';
import { createContext, useState, useCallback, useEffect } from 'react';

import { Settings } from '../types/Settings';
import { getSavedSettings, saveSettings } from '../utils/settings';

interface SettingsContextValue {
  settings: Settings;
  setSettings: (settings: SettingsContextValue['settings']) => void;
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: {} as SettingsContextValue['settings'],
  setSettings: () => {},
});

const defaultSettings: Settings = {
  hideSpoilers: false,
  language: 'en',
  notifications: {
    LeagueOfLegendsLEC: true,
    LeagueOfLegendsLFL: true,
    RocketLeague: true,
    SuperSmashBrosUltimate: true,
    TeamfightTacticsGSC: true,
    TFT: true,
    TrackMania: true,
    ValorantVCT: true,
    ValorantVCT_GC: true,
  },
};

export const SettingsProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: Settings;
}) => {
  const [settings, _setSettings] = useState<Settings>({
    language: Localization.locale.split('-')[0],
  } as Settings);

  useEffect(() => {
    getSavedSettings().then((savedSettings) => {
      _setSettings(defu<Settings, Settings[]>(value, savedSettings, defaultSettings));
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
