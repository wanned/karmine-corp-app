type Language = 'en';

export type Translations = Record<
  Language,
  {
    home: {
      screenName: string;
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
    };
  }
>;
