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
    tomorrow: 'Demain',
    today: "Aujourd'hui",
    yesterday: 'Hier',
  },
  calendar: {
    screenName: 'Calendrier',
    noMatchesToday: "Aucun match aujourd'hui",
  },
  teams: {
    screenName: 'Équipes',
    leaderboardTitle: 'Classement',
    playersTitle: 'Membres',
    winAbbr: 'V',
    lossAbbr: 'D',
    pointsAbbr: 'pts',
  },
  settings: {
    screenName: 'Paramètres',
    version: 'Version',
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
    other: {
      title: 'Autre',
      buttonTitles: {
        bugReport: 'Signaler un bug',
        karmineCorpWebsite: 'Aller sur karminecorp.fr',
        karmineCorpTwitter: 'Visiter le X de Karmine Corp',
        credits: 'Crédits',
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
    noGameDetails: 'Aucun détail de match disponible',
  },
};
