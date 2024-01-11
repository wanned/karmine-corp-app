import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';

type Language = 'en' | 'es' | 'fr';

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
    };
    settings: {
      screenName: string;
    };
    games: {
      [K in KarmineApi.CompetitionName]: string;
    };
  }
>;
