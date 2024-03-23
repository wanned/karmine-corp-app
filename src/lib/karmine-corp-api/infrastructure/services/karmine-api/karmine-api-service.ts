import { Context, Effect } from 'effect';
import { z } from 'zod';

import { KarmineApi } from './karmine-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const KARMINE_API_SERVICE_TAG = 'KarmineApiService';

export class KarmineApiService extends Context.Tag(KARMINE_API_SERVICE_TAG)<
  KarmineApiService,
  {
    getEvents(): Effect.Effect<KarmineApi.GetEvents, z.ZodError<any>, FetchService | EnvService>;
    getEventsResults(): Effect.Effect<
      KarmineApi.GetEventsResults,
      z.ZodError<any>,
      FetchService | EnvService
    >;
    getPlayers(): Effect.Effect<KarmineApi.GetPlayers, z.ZodError<any>, FetchService | EnvService>;
    getTwitch(): Effect.Effect<KarmineApi.GetTwitch, z.ZodError<any>, FetchService | EnvService>;
    getGames(): Effect.Effect<KarmineApi.GetGames, z.ZodError<any>, FetchService | EnvService>;
  }
>() {}
