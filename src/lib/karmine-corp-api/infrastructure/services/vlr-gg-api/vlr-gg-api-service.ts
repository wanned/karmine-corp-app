import { Context, Effect } from 'effect';

import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const VLRGG_API_SERVICE_TAG = 'VlrGgApiService';

export class VlrGgApiService extends Context.Tag(VLRGG_API_SERVICE_TAG)<
  VlrGgApiService,
  {
    getMatches(args: {
      status: 'completed' | 'upcoming';
      teamId: string;
      page?: number;
    }): Effect.Effect<
      {
        html: string;
      },
      never,
      FetchService | EnvService
    >;
    getMatch(args: { gameId: string }): Effect.Effect<
      {
        html: string;
      },
      never,
      FetchService | EnvService
    >;
    getPlayer(args: { playerId: string }): Effect.Effect<
      {
        html: string;
      },
      never,
      FetchService | EnvService
    >;
  }
>() {}
