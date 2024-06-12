import { Translations } from './Translations';

export const frTranslations: Translations['fr'] = {
  onboarding: {
    pages: {
      0: {
        title: 'Bienvenue sur Karmine Plus !',
        description:
          'Karmine Plus est une application non-officielle. Suivez les matchs de Karmine Corp et plus encore.',
      },
      1: {
        title: 'Notifications',
        description: 'Choisissez les jeux pour lesquels vous recevrez des notifications.',
      },
      2: {
        title: 'Spoiler',
        description:
          'Vous ne voulez pas connaître les résultats ? Désactivez les spoilers.\nPour les réveler, rester simplement appuyé sur un match.',
      },
      3: {
        title: "C'est parti !",
        description: 'Découvrez les derniers résultats et les prochains matchs.',
      },
    },
    startButton: 'Démarrer',
    nextButton: 'Suivant',
  },
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
    notAffiliated: 'Non affilié à Karmine Corp',
    notifications: {
      title: 'Notifications',
      description: 'Choisissez les jeux pour lesquels vous recevrez des notifications.',
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
  credits: {
    screenName: 'Crédits',
    contributors: {
      title: 'Contributeurs',
      description: 'Merci à toutes les personnes qui permettent à cette application d’exister.',
    },
    apis: {
      title: 'APIs',
      description: 'Les données de l’application proviennent des sources suivantes.',
    },
    libraries: {
      title: 'Librairies',
      description: 'Cette application fonctionne grâce aux librairies suivantes.',
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
    Fortnite: 'Fortnite',
  },
  gameDetails: {
    gamesTitle: 'Games',
    playersTitle: 'Joueurs',
    gamePrefix: 'Game',
    watchReplayText: 'Voir le replay',
    goalsText: 'Buts',
    stopsText: 'Arrêts',
    totalText: 'Total des points',
    cancelNotificationButtonText: 'Annuler la notification',
    watchStreamButtonText: 'Regarder le stream',
    shareStreamButtonText: 'Partager le stream',
    noGameDetails: 'Aucun détail de match disponible',
  },
  notifications: {
    matchStarting: [
      ({ game, karmineName, opponentName }) => {
        return {
          title:
            opponentName !== undefined ?
              `${game} : ${karmineName} vs ${opponentName}`
            : `${game} : ${karmineName}`,
          body: 'Le match va bientôt commencer',
        };
      },
    ],
    matchScoreUpdated: [
      ({
        game,
        karmineName,
        karmineScore,
        oldKarmineScore,
        opponentName,
        opponentScore,
        oldOpponentScore,
        scoreType,
      }) => {
        let title = '';
        let scoreTitle = `(${scoreType === 'top' ? 'Top ' : ''}${karmineScore}`;
        if (opponentScore !== undefined)
          scoreTitle += ` - ${scoreType === 'top' ? 'Top ' : ''}${opponentScore}`;
        scoreTitle += ')';

        title = `${scoreTitle} ${game} : ${karmineName}${
          opponentName ? ` vs ${opponentName}` : ''
        }`;

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
    ],
    matchFinished: [
      ({
        game,
        karmineName,
        karmineScore,
        opponentName,
        opponentScore,
        showResults,
        scoreType,
      }) => {
        let title = '';

        if (showResults) {
          let scoreTitle = `(${scoreType === 'top' ? 'Top ' : ''}${karmineScore}`;
          if (opponentScore !== undefined)
            scoreTitle += ` - ${scoreType === 'top' ? 'Top ' : ''}${opponentScore}`;
          scoreTitle += ')';
          title += `${scoreTitle} `;
        }

        title += `${game} : ${karmineName}${opponentName ? ` vs ${opponentName}` : ''}`;

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
    ],
  },
  shareMessages: {
    watchStream: [
      ({ game, karmineName, opponentName, link }) => {
        return `Regardez le match de ${game} : ${karmineName}${
          opponentName ? ` vs ${opponentName}` : ''
        } sur ${link}`;
      },
    ],
  },
};
