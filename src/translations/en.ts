import { Translations } from './Translations';

export const enTranslations: Translations['en'] = {
  home: {
    screenName: 'Home',
    nextMatchesTitle: 'Next matches',
    nextMatchesViewMoreText: 'View all matches',
    lastResultsTitle: 'Last results',
    lastResultsViewMoreText: 'View all results',
    views: 'views',
    likes: 'likes',
    noMatches: 'No matches',
  },
  calendar: {
    screenName: 'Calendar',
  },
  teams: {
    screenName: 'Teams',
    leaderboardTitle: 'Leaderboard',
    playersTitle: 'Members',
  },
  settings: {
    screenName: 'Settings',
    version: 'Version',
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
    other: {
      title: 'Other',
      buttonTitles: {
        bugReport: 'Report a bug',
        karmineCorpWebsite: 'Go to karminecorp.fr',
        karmineCorpTwitter: "Visit Karmine Corp's X",
        credits: 'Credits',
      },
    },
  },
  games: {
    LeagueOfLegendsLFL: 'LFL',
    LeagueOfLegendsLEC: 'LEC',
    RocketLeague: 'Rocket League',
    SuperSmashBrosUltimate: 'Smash Bros',
    TFT: 'TFT',
    TeamfightTacticsGSC: 'TFT',
    TrackMania: 'Trackmania',
    ValorantVCT: 'Valorant',
    ValorantVCT_GC: 'Valorant Women',
  },
};
