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
  }
>;
