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
    tomorrow: 'Tomorrow',
    today: 'Today',
    yesterday: 'Yesterday',
  },
  calendar: {
    screenName: 'Calendar',
    noMatchesToday: 'No match today',
  },
  teams: {
    screenName: 'Teams',
    leaderboardTitle: 'Leaderboard',
    playersTitle: 'Members',
    winAbbr: 'W',
    lossAbbr: 'L',
    pointsAbbr: 'pts',
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
  gameDetails: {
    gamesTitle: 'Games',
    playersTitle: 'Players',
    gamePrefix: 'Game',
    watchReplayText: 'Watch replay',
    goalsText: 'Goals',
    stopsText: 'Stops',
    totalText: 'Total points',
    beNotifiedButtonText: 'Be notified',
    cancelNotificationButtonText: 'Cancel notification',
    watchStreamButtonText: 'Watch stream',
    shareStreamButtonText: 'Share stream',
    noGameDetails: 'No game details available',
  },
  notifications: {
    matchStarting: [
      ({ game, karmineName, opponentName }) => {
        return {
          title:
            opponentName !== undefined ?
              `${game} : ${karmineName} vs ${opponentName}`
            : `${game} : ${karmineName}`,
          body: 'The match is about to start',
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

        const defaultBody = 'The scores have changed';

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
            return `${teamName} is back to a tie`;
          }
          if (oldKarmineScore === oldOpponentScore && teamScore > opponentScore) {
            return `${teamName} takes the lead`;
          }
          if (teamScore > opponentScore) {
            return `${teamName} increases its lead`;
          }
          if (teamScore < opponentScore) {
            return `${teamName} reduces the gap`;
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
          return { title, body: 'The match is over' };
        }

        if (karmineName.toLowerCase().startsWith('karmine')) {
          karmineName = `The ${karmineName}`;
        }

        return {
          title,
          body: karmineScore > opponentScore ? `${karmineName} won` : `${karmineName} lost`,
        };
      },
    ],
  },
};
