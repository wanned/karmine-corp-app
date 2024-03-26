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
  notifications: {
    matchStarting: ({ game, karmineName, opponentName }) => {
      return {
        title:
          opponentName !== undefined ?
            `${game} : ${karmineName} vs ${opponentName}`
          : `${game} : ${karmineName}`,
        body: 'Le match va bientôt commencer',
      };
    },
    matchScoreUpdated: ({
      game,
      karmineName,
      karmineScore,
      oldKarmineScore,
      opponentName,
      opponentScore,
      oldOpponentScore,
    }) => {
      const title =
        opponentScore !== undefined && opponentName !== undefined ?
          `(${karmineScore} - ${opponentScore}) ${game} : ${karmineName} vs ${opponentName}`
        : `(${karmineScore}) ${game} : ${karmineName}`;
      const defaultBody = 'Les scores ont changé';

      if (
        opponentScore === undefined ||
        oldOpponentScore === undefined ||
        opponentName === undefined
      ) {
        return { title, body: defaultBody };
      }

      const generateBody = (teamName: string, teamScore: number, opponentScore: number) => {
        // The team just scored
        if (teamScore === opponentScore) {
          return `${teamName} revient à égalité`;
        }
        if (oldKarmineScore === oldOpponentScore && teamScore > opponentScore) {
          return `${teamName} prend l'avantage`;
        }
        if (teamScore > opponentScore) {
          return `${teamName} augmente son avance`;
        }
        if (teamScore < opponentScore) {
          return `${teamName} réduit l'écart`;
        }

        return defaultBody;
      };

      if (oldKarmineScore < karmineScore) {
        return { title, body: generateBody(karmineName, karmineScore, opponentScore) };
      }

      if (oldOpponentScore < opponentScore) {
        return { title, body: generateBody(opponentName, opponentScore, karmineScore) };
      }

      return { title, body: defaultBody };
    },
    matchFinished: ({
      game,
      karmineName,
      karmineScore,
      opponentName,
      opponentScore,
      showResults,
    }) => {
      let title = `${game} : ${karmineName}${opponentName ? ` vs ${opponentName}` : ''}`;
      if (showResults) {
        let score = `(${karmineScore}`;
        if (opponentScore !== undefined) {
          score += ` - ${opponentScore}`;
        }
        score += ')';
        title = `${score} ${title}`;
      }

      if (!showResults || opponentScore === undefined || opponentName === undefined) {
        return { title, body: 'Le match est terminé' };
      }

      if (karmineName.toLowerCase().startsWith('karmine')) {
        karmineName = `La ${karmineName}`;
      }

      return {
        title,
        body: karmineScore > opponentScore ? `${karmineName} a gagné` : `${karmineName} a perdu`,
      };
    },
  },
};
