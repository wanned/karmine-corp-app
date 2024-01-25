import AsyncStorage from '@react-native-async-storage/async-storage';
import defu from 'defu';
import * as Localization from 'expo-localization';
import { createContext, useState, useCallback, useEffect } from 'react';

import { Settings } from '../types/Settings';

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

const SETTINGS_ASYNC_STORAGE_KEY = 'settings';

async function saveSettings(settings: Settings) {
  console.log(settings.hideSpoilers, settings.language);

  try {
    await AsyncStorage.setItem(SETTINGS_ASYNC_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error(error);
  }
}

async function getSavedSettings(): Promise<Settings> {
  try {
    const savedSettingsString = await AsyncStorage.getItem(SETTINGS_ASYNC_STORAGE_KEY);
    return JSON.parse(savedSettingsString || '{}') as Settings;
  } catch (error) {
    console.error(error);
  }
  return {} as Settings;
}
