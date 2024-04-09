import * as v from '@badrap/valita';
import { Context, Effect } from 'effect';

import { LiquipediaParseApi } from './liquipedia-parse-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const LIQUIPEDIA_API_SERVICE_TAG = 'LiquipediaApiService';

export class LiquipediaApiService extends Context.Tag(LIQUIPEDIA_API_SERVICE_TAG)<
  LiquipediaApiService,
  {
    parse(args: {
      page: string;
      game: string;
    }): Effect.Effect<LiquipediaParseApi.Parse, v.ValitaError, FetchService | EnvService>;
  }
>() {}
