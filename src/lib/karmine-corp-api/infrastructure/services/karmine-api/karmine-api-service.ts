import * as v from '@badrap/valita';
import { Context, Effect } from 'effect';

import { KarmineApi } from './karmine-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const KARMINE_API_SERVICE_TAG = 'KarmineApiService';

export class KarmineApiService extends Context.Tag(KARMINE_API_SERVICE_TAG)<
  KarmineApiService,
  {
    getEvents(): Effect.Effect<KarmineApi.GetEvents, v.Err, FetchService | EnvService>;
    getEventsResults(): Effect.Effect<
      KarmineApi.GetEventsResults,
      v.Err,
      FetchService | EnvService
    >;
    getPlayers(): Effect.Effect<KarmineApi.GetPlayers, v.Err, FetchService | EnvService>;
    getTwitch(): Effect.Effect<KarmineApi.GetTwitch, v.Err, FetchService | EnvService>;
    getGames(): Effect.Effect<KarmineApi.GetGames, v.Err, FetchService | EnvService>;
  }
>() {}
