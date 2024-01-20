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
    };
    teams: {
      screenName: string;
    };
    settings: {
      screenName: string;
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
