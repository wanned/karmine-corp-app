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
    };
    calendar: {
      screenName: string;
    };
    teams: {
      screenName: string;
      leaderboardTitle: string;
      playersTitle: string;
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
  }
>;
