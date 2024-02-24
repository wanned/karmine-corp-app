import { CoreData } from '../data/core/types';

import { Language } from '~/translations/Translations';

export interface Settings {
  language: Language;
  notifications: Record<CoreData.CompetitionName, boolean>;
  hideSpoilers: boolean;
}
