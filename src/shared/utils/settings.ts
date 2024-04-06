import defu from 'defu';
import * as Localization from 'expo-localization';
import { MMKV } from 'react-native-mmkv';

import { Settings } from '../types/Settings';

import { Language } from '~/translations/Translations';

const storage = new MMKV();
const SETTINGS_STORAGE_KEY = 'settings';

const defaultSettings: Settings = {
  showResults: true,
  language: (Localization.getLocales()[0].languageCode as Language) ?? 'en',
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

export async function saveSettings(settings: Settings) {
  try {
    storage.set(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error(error);
  }
}

export async function getSettings(): Promise<Settings> {
  let settings: Partial<Settings> = {};

  try {
    const savedSettingsString = storage.getString(SETTINGS_STORAGE_KEY);
    settings = JSON.parse(savedSettingsString || '{}') as Settings;
  } catch (error) {
    console.error(error);
  }

  return defu<Settings, Settings[]>(settings, defaultSettings);
}
