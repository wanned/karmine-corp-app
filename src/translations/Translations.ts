import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';

export type Language = 'en' | 'es' | 'fr';

export type Translations = Record<
  Language,
  {
    home: {
      screenName: string;
      nextMatchesTitle: string;
      nextMatchesViewMoreText: string;
      lastResultsTitle: string;
      lastResultsViewMoreText: string;
      views: string;
      likes: string;
      noMatches: string;
    };
    calendar: {
      screenName: string;
      noMatchesToday: string;
    };
    teams: {
      screenName: string;
      leaderboardTitle: string;
      playersTitle: string;
    };
    settings: {
      screenName: string;
      version: string;
      notifications: {
        title: string;
        description: string;
      };
      spoiler: {
        title: string;
        showResults: string;
      };
      language: {
        title: string;
        description: string;
        languages: Record<Language, string>;
      };
      other: {
        title: string;
        buttonTitles: {
          bugReport: string;
          karmineCorpWebsite: string;
          karmineCorpTwitter: string;
          credits: string;
        };
      };
    };
    games: {
      [K in KarmineApi.CompetitionName]: string;
    };
    gameDetails: {
      gamesTitle: string;
      playersTitle: string;
      gamePrefix: string;
      watchReplayText: string;
      goalsText: string;
      stopsText: string;
      totalText: string;
      beNotifiedButtonText: string;
      cancelNotificationButtonText: string;
      watchStreamButtonText: string;
      shareStreamButtonText: string;
    };
  }
>;
