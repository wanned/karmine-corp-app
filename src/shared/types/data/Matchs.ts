import { Player } from '~/screens/game-details-modal/components/types/player';
import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';

export type Matchs = Match[];

export interface Match {
  teams: {
    name: string;
    logoUrl: string;
    score?:
      | {
          score: number;
          scoreType?: 'top';
          isWinner?: boolean;
        }
      | undefined;
    players: Player[];
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
}

export interface LeagueOfLegendsGame {
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
  duration: number;
  score: Record<'blue' | 'red', number>;
}
