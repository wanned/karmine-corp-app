import { z } from 'zod';

import { youtubeApiSchemas } from './schemas/youtube-api-schemas';

export namespace YoutubeApi {
  export interface GetVideos extends z.infer<typeof youtubeApiSchemas.getVideos> {}
}
