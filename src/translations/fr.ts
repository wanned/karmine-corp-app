import { Translations } from './Translations';

export const frTranslations: Translations['fr'] = {
  home: {
    screenName: 'Accueil',
    nextMatchesTitle: 'Les prochains matchs',
    nextMatchesViewMoreText: 'Voir tous les matchs',
    lastResultsTitle: 'Les derniers résultats',
    lastResultsViewMoreText: 'Voir tous les résultats',
    views: 'vues',
    likes: 'likes',
    noMatches: 'Aucun matchs',
  },
  calendar: {
    screenName: 'Calendrier',
    noMatchesToday: "Aucun match aujourd'hui",
  },
  teams: {
    screenName: 'Equipes',
  },
  settings: {
    screenName: 'Paramètres',
    notifications: {
      title: 'Notifications',
      description: 'Choisissez les matchs pour lesquels vous recevrez des notifications.',
    },
    spoiler: {
      title: 'Spoiler',
      showResults: 'Afficher les résultats',
    },
    language: {
      title: 'Langue',
      description: "Choisissez la langue de l'application.",
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français',
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
    ValorantVCT_GC: 'Valorant Féminin',
  },
};
