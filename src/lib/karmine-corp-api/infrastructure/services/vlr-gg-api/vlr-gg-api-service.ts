import { Context, Effect } from 'effect';

import { VlrGgApi } from './vlr-gg-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';
import { HtmlToJsonService } from '../html-to-json/html-to-json-service';

const VLRGG_API_SERVICE_TAG = 'VlrGgApiService';

export class VlrGgApiService extends Context.Tag(VLRGG_API_SERVICE_TAG)<
  VlrGgApiService,
  {
    getMatches(args: {
      status: 'completed' | 'upcoming';
      teamId: string;
      page?: number;
    }): Effect.Effect<VlrGgApi.GetMatches, never, FetchService | EnvService>;
    getMatch(args: {
      gameId: string;
    }): Effect.Effect<VlrGgApi.GetMatch, never, FetchService | EnvService | HtmlToJsonService>;
    getPlayer(args: {
      playerId: string;
    }): Effect.Effect<VlrGgApi.GetPlayer, never, FetchService | EnvService>;
  }
>() {}
