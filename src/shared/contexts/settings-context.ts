import { createContext } from 'react';

import { KarmineApi } from '../apis/karmine/types/KarmineApi';

interface SettingsContextValue {
  settings: {
    language: string; // TODO: use Language type when the PR is merged
    notifications: Record<KarmineApi.CompetitionName, boolean>;
    hideSpoilers: boolean;
  };
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: {} as SettingsContextValue['settings'],
});

export { SettingsContext };
