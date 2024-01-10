import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';

export type Matchs = Match[];

export interface Match {
  teams: {
    name: string;
    logoUrl: string;
  }[];
  date: Date;
  streamLink: string;
  matchDetails: MatchDetails;
}

export type MatchDetails = LeagueOfLegendsMatchDetails | BaseMatchDetails;

interface BaseMatchDetails {
  game: KarmineApi.CompetitionName;
}

export interface LeagueOfLegendsMatchDetails extends BaseMatchDetails {
  game:
    | KarmineApi.CompetitionName.LeagueOfLegendsLFL
    | KarmineApi.CompetitionName.LeagueOfLegendsLEC;
  games: LeagueOfLegendsGame[];
  bo: number;
  players: Record<
    string,
    {
      name: string;
      imageUrl: string;
      role: string;
    }[]
  >;
}

interface LeagueOfLegendsGame {
  draft: Record<
    'blue' | 'red',
    {
      picks: {
        champion: {
          name: string;
          imageUrl: string;
        };
        player: string;
      }[];
    }
  >;
  score: Record<'blue' | 'red', number>;
}
