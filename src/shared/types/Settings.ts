import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { Language } from '~/translations/Translations';

export interface Settings {
  language: Language;
  notifications: Record<CoreData.CompetitionName, boolean>;
  showResults: boolean;
}
