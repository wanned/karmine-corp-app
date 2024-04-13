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
    }): Effect.Effect<LeagueOfLegendsApi.GetMatch, v.Err, FetchService | EnvService>;
    getTeams(): Effect.Effect<LeagueOfLegendsApi.GetTeams, v.Err, FetchService | EnvService>;
    getSchedule(args: {
      leagueIds: string[];
      pageToken?: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetSchedule, v.Err, FetchService | EnvService>;
    getGameWindow(args: {
      gameId: string;
      startingTime?: Date;
    }): Effect.Effect<LeagueOfLegendsApi.GetGameWindow, v.Err, FetchService | EnvService>;
    getVersions(): Effect.Effect<LeagueOfLegendsApi.GetVersions, v.Err, FetchService | EnvService>;
    getTournaments(args: {
      leagueIds: string[];
    }): Effect.Effect<LeagueOfLegendsApi.GetTournaments, v.Err, FetchService | EnvService>;
    getStandings(args: {
      tournamentId: string;
    }): Effect.Effect<LeagueOfLegendsApi.GetStandings, v.Err, FetchService | EnvService>;
  }
>() {}
