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
  },
  teams: {
    screenName: 'Équipes',
    leaderboardTitle: 'Classement',
    playersTitle: 'Membres',
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
  gameDetails: {
    gamesTitle: 'Games',
    playersTitle: 'Joueurs',
    gamePrefix: 'Game',
    watchReplayText: 'Voir le replay',
    goalsText: 'Buts',
    stopsText: 'Arrêts',
    totalText: 'Total des points',
    beNotifiedButtonText: 'Être notifié',
    cancelNotificationButtonText: 'Annuler la notification',
    watchStreamButtonText: 'Regarder le stream',
    shareStreamButtonText: 'Partager le stream',
  },
};
