import { Context, Effect } from 'effect';
import { z } from 'zod';

import { OctaneApi } from './octane-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const OCTANE_API_SERVICE_TAG = 'OctaneApiService';

export class OctaneApiService extends Context.Tag(OCTANE_API_SERVICE_TAG)<
  OctaneApiService,
  {
    getMatches(args: {
      teamId?: string;
      page?: number;
      perPage?: number;
    }): Effect.Effect<OctaneApi.GetMatches, z.ZodError<any>, FetchService | EnvService>;
    getMatchGames(args: {
      matchId: string;
    }): Effect.Effect<OctaneApi.GetMatchGames, z.ZodError<any>, FetchService | EnvService>;
  }
>() {}
