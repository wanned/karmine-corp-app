import { Context, Effect } from 'effect';
import { z } from 'zod';

import { YoutubeApi } from './youtube-api';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const YOUTUBE_API_SERVICE_TAG = 'YoutubeApiService';

export class YoutubeApiService extends Context.Tag(YOUTUBE_API_SERVICE_TAG)<
  YoutubeApiService,
  {
    getVideos(): Effect.Effect<YoutubeApi.GetVideos, z.ZodError<any>, FetchService | EnvService>;
  }
>() {}
