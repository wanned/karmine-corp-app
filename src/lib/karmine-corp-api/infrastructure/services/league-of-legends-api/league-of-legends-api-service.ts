import { Context, Effect } from 'effect';
import { z } from 'zod';

import { LeagueOfLegendsApi } from './league-of-legends-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const LEAGUE_OF_LEGENDS_API_SERVICE_TAG = 'LeagueOfLegendsApiService';

export class LeagueOfLegendsApiService extends Context.Tag(LEAGUE_OF_LEGENDS_API_SERVICE_TAG)<
  LeagueOfLegendsApiService,
  {
    getMatch(args: {
      matchId: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetMatch, z.ZodError<any>, FetchService | EnvService>;
    getTeams(): Effect.Effect<
      LeagueOfLegendsApi.GetTeams,
      z.ZodError<any>,
      FetchService | EnvService
    >;
    getSchedule(args: {
      leagueIds: string[];
      pageToken?: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetSchedule, z.ZodError<any>, FetchService | EnvService>;
    getGameWindow(args: {
      gameId: string;
      startingTime?: Date;
    }): Effect.Effect<LeagueOfLegendsApi.GetGameWindow, z.ZodError<any>, FetchService | EnvService>;
    getVersions(): Effect.Effect<
      LeagueOfLegendsApi.GetVersions,
      z.ZodError<any>,
      FetchService | EnvService
    >;
    getTournaments(args: {
      leagueIds: string[];
    }): Effect.Effect<
      LeagueOfLegendsApi.GetTournaments,
      z.ZodError<any>,
      FetchService | EnvService
    >;
    getStandings(args: {
      tournamentId: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetStandings, z.ZodError<any>, FetchService | EnvService>;
  }
>() {}
