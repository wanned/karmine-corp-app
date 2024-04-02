import * as v from '@badrap/valita';

import { youtubeApiSchemas } from './schemas/youtube-api-schemas';

export namespace YoutubeApi {
  export interface GetVideos extends v.Infer<typeof youtubeApiSchemas.getVideos> {}
}
