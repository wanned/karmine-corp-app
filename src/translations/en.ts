import { Translations } from './Translations';

export const enTranslations: Translations['en'] = {
  home: {
    screenName: 'Home',
    nextMatchesTitle: 'Next matches',
    nextMatchesViewMoreText: 'View all matches',
    lastResultsTitle: 'Last results',
    lastResultsViewMoreText: 'View all results',
  },
  calendar: {
    screenName: 'Calendar',
  },
  teams: {
    screenName: 'Teams',
  },
  settings: {
    screenName: 'Settings',
    notifications: {
      title: 'Notifications',
      description: 'Choose the games you will receive notifications for.',
    },
    spoiler: {
      title: 'Spoiler',
      showResults: 'Show results',
    },
    language: {
      title: 'Language',
      description: 'Choose the language of the application.',
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français',
      },
    },
  },
};
