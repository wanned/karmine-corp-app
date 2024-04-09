import * as v from '@badrap/valita';
import { Context, Effect } from 'effect';

import { LeagueOfLegendsApi } from './league-of-legends-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const LEAGUE_OF_LEGENDS_API_SERVICE_TAG = 'LeagueOfLegendsApiService';

export class LeagueOfLegendsApiService extends Context.Tag(LEAGUE_OF_LEGENDS_API_SERVICE_TAG)<
  LeagueOfLegendsApiService,
  {
    getMatch(args: {
      matchId: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetMatch, v.ValitaError, FetchService | EnvService>;
    getTeams(): Effect.Effect<
      LeagueOfLegendsApi.GetTeams,
      v.ValitaError,
      FetchService | EnvService
    >;
    getSchedule(args: {
      leagueIds: string[];
      pageToken?: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetSchedule, v.ValitaError, FetchService | EnvService>;
    getGameWindow(args: {
      gameId: string;
      startingTime?: Date;
    }): Effect.Effect<LeagueOfLegendsApi.GetGameWindow, v.ValitaError, FetchService | EnvService>;
    getVersions(): Effect.Effect<
      LeagueOfLegendsApi.GetVersions,
      v.ValitaError,
      FetchService | EnvService
    >;
    getTournaments(args: {
      leagueIds: string[];
    }): Effect.Effect<LeagueOfLegendsApi.GetTournaments, v.ValitaError, FetchService | EnvService>;
    getStandings(args: {
      tournamentId: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetStandings, v.ValitaError, FetchService | EnvService>;
  }
>() {}
