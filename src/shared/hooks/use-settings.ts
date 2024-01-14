import { useContext } from 'react';

import { SettingsContext } from '../contexts/settings-context';

export const useSettings = () => {
  return useContext(SettingsContext).settings;
};
