import { IsoDate } from '~/shared/types/IsoDate';

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
    bo?: number;
    players?: Record<'home' | 'away', Player[]>;
  }

  export interface BaseMatch<MD extends BaseMatchDetails = BaseMatchDetails> {
    id: string;
    teams: [Team & { score?: Score }, (Team & { score?: Score }) | null];
    date: Date | IsoDate;
    streamLink: string | null;
    status: 'upcoming' | 'live' | 'finished';
    matchDetails: MD;
  }

  export type Match = LeagueOfLegendsMatch | RocketLeagueMatch | ValorantMatch | BaseMatch;
  export type LeagueOfLegendsMatch = BaseMatch<LeagueOfLegendsMatchDetails>;
  export type RocketLeagueMatch = BaseMatch<RocketLeagueMatchDetails>;
  export type ValorantMatch = BaseMatch<ValorantMatchDetails>;

  interface LeagueOfLegendsMatchDetails extends BaseMatchDetails {
    competitionName: CompetitionName.LeagueOfLegendsLFL | CompetitionName.LeagueOfLegendsLEC;
    games: LeagueOfLegendsGame[];
  }

  export interface LeagueOfLegendsGame {
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

  interface RocketLeagueMatchDetails extends BaseMatchDetails {
    competitionName: CompetitionName.RocketLeague;
    games: (RocketLeagueGame | undefined)[];
  }

  export interface RocketLeagueGame {
    teams: Record<
      'home' | 'away',
      {
        goals: number;
        stops: number;
        totalPoints: number;
      }
    >;
  }

  interface ValorantMatchDetails extends BaseMatchDetails {
    competitionName: CompetitionName.ValorantVCT | CompetitionName.ValorantVCTGC;
    games: ValorantGame[];
  }

  export interface ValorantGame {
    mapName: string;
    score: Record<'home' | 'away', number>;
    composition: Record<
      'home' | 'away',
      {
        agent: {
          name: string;
          imageUrl: string;
        };
      }[]
    >;
  }

  export interface YoutubeVideo {
    id: string;
    title: string;
    url: string;
    publishedAt: Date | IsoDate;
    views: number;
    likes: number;
    thumbnailUrl: string;
  }

  export interface KarminePlayer extends Player {
    streamLink?: string;
    isStreaming: boolean;
  }

  export type KarminePlayers = Partial<Record<CompetitionName, KarminePlayer[]>>;

  export interface LeaderboardItem {
    teamName: string;
    teamId: string;
    logoUrl: string;
    position: number;
    wins?: number;
    looses?: number;
    points?: number;
  }

  export type Leaderboards = Partial<Record<CompetitionName, LeaderboardItem[]>>;

  export namespace Notifications {
    interface BaseNotification<T extends string> {
      type: T;
      createdAt: IsoDate;
    }

    interface NotificationMatch extends BaseMatch {}

    export interface MatchStartingSoonNotification extends BaseNotification<'matchStarting'> {
      match: NotificationMatch;
    }

    export interface MatchFinishedNotification extends BaseNotification<'matchFinished'> {
      match: NotificationMatch;
    }

    export interface MatchScoreUpdatedNotification extends BaseNotification<'matchScoreUpdated'> {
      match: NotificationMatch;
      oldMatch: NotificationMatch;
    }

    export interface NewMatchEntryNotification extends BaseNotification<'newMatchEntry'> {
      match: NotificationMatch;
    }

    export type Notification =
      | MatchStartingSoonNotification
      | MatchFinishedNotification
      | MatchScoreUpdatedNotification
      | NewMatchEntryNotification;
  }
}
