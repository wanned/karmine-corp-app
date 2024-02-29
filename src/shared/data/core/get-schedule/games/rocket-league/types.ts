import { OctaneApiClient } from '~/shared/data/external-apis/octane/octane-api-client';

export type RlApiMatch = Awaited<ReturnType<OctaneApiClient['getMatches']>>['matches'][number];
export interface RLMatch {
  _id: string;
  blue: {
    players: Array<any>;
    score: number | undefined;
    team: any;
    winner: boolean;
  };
  date: Date;
  format: {
    length: number;
    type: string;
  };
  orange: {
    players: Array<any>;
    score: number | undefined;
    team: any;
    winner: boolean;
  };
}
