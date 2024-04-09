import * as v from '@badrap/valita';
import { Context, Effect } from 'effect';

import { KarmineApi } from './karmine-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const KARMINE_API_SERVICE_TAG = 'KarmineApiService';

export class KarmineApiService extends Context.Tag(KARMINE_API_SERVICE_TAG)<
  KarmineApiService,
  {
    getEvents(): Effect.Effect<KarmineApi.GetEvents, v.ValitaError, FetchService | EnvService>;
    getEventsResults(): Effect.Effect<
      KarmineApi.GetEventsResults,
      v.ValitaError,
      FetchService | EnvService
    >;
    getPlayers(): Effect.Effect<KarmineApi.GetPlayers, v.ValitaError, FetchService | EnvService>;
    getTwitch(): Effect.Effect<KarmineApi.GetTwitch, v.ValitaError, FetchService | EnvService>;
    getGames(): Effect.Effect<KarmineApi.GetGames, v.ValitaError, FetchService | EnvService>;
  }
>() {}
