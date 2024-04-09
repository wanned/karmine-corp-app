import { Context, Effect } from 'effect';

import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const VLR_API_SERVICE_TAG = 'VlrApiService';

export class VlrApiService extends Context.Tag(VLR_API_SERVICE_TAG)<
  VlrApiService,
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
