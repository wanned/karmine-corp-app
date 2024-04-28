import * as v from '@badrap/valita';
import { Context, Effect } from 'effect';

import { YoutubeApi } from './youtube-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const YOUTUBE_API_SERVICE_TAG = 'YoutubeApiService';

export class YoutubeApiService extends Context.Tag(YOUTUBE_API_SERVICE_TAG)<
  YoutubeApiService,
  {
    getVideos(): Effect.Effect<YoutubeApi.GetVideos, v.ValitaError, FetchService | EnvService>;
  }
>() {}
