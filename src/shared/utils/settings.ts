import AsyncStorage from '@react-native-async-storage/async-storage';

import { Settings } from '../types/Settings';

const SETTINGS_ASYNC_STORAGE_KEY = 'settings';

export async function saveSettings(settings: Settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_ASYNC_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error(error);
  }
}

export async function getSavedSettings(): Promise<Settings> {
  try {
    const savedSettingsString = await AsyncStorage.getItem(SETTINGS_ASYNC_STORAGE_KEY);
    return JSON.parse(savedSettingsString || '{}') as Settings;
  } catch (error) {
    console.error(error);
  }
  return {} as Settings;
}
