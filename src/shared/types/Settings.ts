import { KarmineApi } from '../apis/karmine/types/KarmineApi';

import { Language } from '~/translations/Translations';

export interface Settings {
  language: Language;
  notifications: Record<KarmineApi.CompetitionName, boolean>;
  hideSpoilers: boolean;
}
