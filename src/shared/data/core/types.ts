export namespace CoreData {
  export interface Team {
    name: string;
    logoUrl: string;
  }

  export interface Score {
    score: number;
    scoreType?: 'top' | 'gameWins';
    isWinner?: boolean;
  }

  export interface Player {
    name: string;
    imageUrl?: string;
    role?: string;
  }

  export enum CompetitionName {
    LeagueOfLegendsLFL = 'LeagueOfLegendsLFL',
    LeagueOfLegendsLEC = 'LeagueOfLegendsLEC',
    RocketLeague = 'RocketLeague',
    SuperSmashBrosUltimate = 'SuperSmashBrosUltimate',
    TFT = 'TFT',
    TeamfightTacticsGSC = 'TeamfightTacticsGSC',
    TrackMania = 'TrackMania',
    ValorantVCT = 'ValorantVCT',
    ValorantVCTGC = 'ValorantVCT_GC',
  }

  interface BaseMatchDetails {
    competitionName: CompetitionName;
  }

  export interface BaseMatch<MD extends BaseMatchDetails = BaseMatchDetails> {
    id: string;
    teams: [Team & { score?: Score }, (Team & { score?: Score }) | null];
    date: Date;
    streamLink: string | null;
    status: 'upcoming' | 'live' | 'finished';
    matchDetails: MD;
  }

  export type Match = LeagueOfLegendsMatch | BaseMatch;
  export type LeagueOfLegendsMatch = BaseMatch<LeagueOfLegendsMatchDetails>;

  interface LeagueOfLegendsMatchDetails extends BaseMatchDetails {
    competitionName: CompetitionName.LeagueOfLegendsLFL | CompetitionName.LeagueOfLegendsLEC;
    games: LeagueOfLegendsGame[];
    bo: number;
    players: Record<'home' | 'away', Player[]>;
  }

  interface LeagueOfLegendsGame {
    draft: Record<
      'home' | 'away',
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
    score: Record<'home' | 'away', number>;
    status: 'live' | 'finished';
    duration?: number;
    winnerTeam?: 'home' | 'away';
  }
}
