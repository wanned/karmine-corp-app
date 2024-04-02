import * as v from '@badrap/valita';
import { Context, Effect } from 'effect';

import { StrafeApi } from './strafe-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const STRAFE_API_SERVICE_TAG = 'StrafeApiService';

export class StrafeApiService extends Context.Tag(STRAFE_API_SERVICE_TAG)<
  StrafeApiService,
  {
    getCalendar(args: {
      date: Date;
    }): Effect.Effect<StrafeApi.GetCalendar, v.Err, FetchService | EnvService>;
    getMatch(args: {
      matchId: number;
    }): Effect.Effect<StrafeApi.GetMatch, never, FetchService | EnvService>;
  }
>() {}
