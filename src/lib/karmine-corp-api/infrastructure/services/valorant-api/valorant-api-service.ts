import * as v from '@badrap/valita';
import { Context, Effect } from 'effect';

import { ValorantApi } from './valorant-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const VALORANT_API_SERVICE_TAG = 'ValorantApiService';

export class ValorantApiService extends Context.Tag(VALORANT_API_SERVICE_TAG)<
  ValorantApiService,
  {
    getAllLeagues(): Effect.Effect<
      ValorantApi.GetAllLeagues,
      v.ValitaError,
      FetchService | EnvService
    >;
    getStandings(args: {
      tournamentIds: string[];
    }): Effect.Effect<
      ValorantApi.GetStandingsByTournamentId,
      v.ValitaError,
      FetchService | EnvService
    >;
  }
>() {}
