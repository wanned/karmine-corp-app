import { Effect, Layer } from 'effect';
import { z } from 'zod';

import { LiquipediaApiService } from './liquipedia-parse-api-service';
import { liquipediaApiSchemas } from './schemas/liquipedia-api-schemas';
import { parseZod } from '../../utils/parse-zod/parse-zod';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const LiquipediaParseApiServiceImpl = Layer.succeed(
  LiquipediaApiService,
  LiquipediaApiService.of({
    parse: ({ page, game }) =>
      fetchLiquipediaParse({
        page,
        game,
        schema: liquipediaApiSchemas.parse,
      }),
  })
);

const getLiquipediaParseUrl = ({ game }: { game: string }) =>
  Effect.Do.pipe(
    () => EnvService,
    Effect.flatMap((envService) => envService.getEnv()),
    Effect.map((env) =>
      env.LIQUIPEDIA_PARSE_API_URL.replace(env.LIQUIPEDIA_PARSE_URL_GAME_REPLACER, game)
    )
  );

const fetchLiquipediaParse = <S extends z.ZodType = z.ZodAny>({
  page,
  game,
  schema,
}: {
  page: string;
  game: string;
  schema: S;
}) =>
  Effect.Do.pipe(
    Effect.bind('fetchService', () => FetchService),
    Effect.bind('url', () => getLiquipediaParseUrl({ game })),
    Effect.flatMap(({ fetchService, url }) =>
      Effect.promise(
        fetchService.fetch<z.output<S>>(url, {
          query: {
            action: 'parse',
            page,
            format: 'json',
          },
          parseResponse:
            schema &&
            ((responseText) =>
              Effect.runSync(parseZod(schema, JSON.parse(responseText), JSON.stringify({ url })))),
        })
      )
    )
  );
