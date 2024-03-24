import { Effect, Layer } from 'effect';
import { z } from 'zod';

import { youtubeApiSchemas } from './schemas/youtube-api-schemas';
import { YoutubeApiService } from './youtube-api-service';
import { parseZod } from '../../utils/parse-zod/parse-zod';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const KARMINE_CHANNEL_ID = 'UCW5Ma_xnAweFIXCGOAZECAA';

export const YoutubeApiServiceImpl = Layer.succeed(
  YoutubeApiService,
  YoutubeApiService.of({
    getVideos: () =>
      fetchYoutube({
        url: 'feeds/videos.xml',
        query: { channel_id: KARMINE_CHANNEL_ID },
        schema: youtubeApiSchemas.getVideos,
      }),
  })
);

const getYoutubeUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.YOUTUBE_API_URL}/${url}`)
  );

const fetchYoutube = <S extends z.ZodType = z.ZodAny>({
  url,
  query,
  schema,
}: {
  url: string;
  query?: Record<string, any | undefined>;
  schema: S;
}) =>
  Effect.Do.pipe(
    Effect.flatMap(() => getYoutubeUrl({ url })),
    Effect.flatMap((url) =>
      Effect.serviceFunction(FetchService, (_) => _.fetch<z.output<S>>)(url, {
        query,
        parseResponse:
          schema &&
          ((responseText) =>
            Effect.runSync(
              parseZod(schema, JSON.parse(responseText), JSON.stringify({ url, query }))
            )),
      })
    ),
    Effect.flatMap(Effect.promise)
  );
