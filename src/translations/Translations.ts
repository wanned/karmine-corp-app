import { CoreData } from '~/shared/data/core/types';

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
      [K in CoreData.CompetitionName]: string;
    };
  }
>;
