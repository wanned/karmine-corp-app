import * as v from '@badrap/valita';
import { Effect, Layer } from 'effect';

import { LiquipediaApiService } from './liquipedia-parse-api-service';
import { liquipediaApiSchemas } from './schemas/liquipedia-api-schemas';
import { parseValita } from '../../utils/parse-valita/parse-valita';
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
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) =>
      env.LIQUIPEDIA_PARSE_API_URL.replace(env.LIQUIPEDIA_PARSE_URL_GAME_REPLACER, game)
    )
  );

const fetchLiquipediaParse = <S extends v.Type = v.Type>({
  page,
  game,
  schema,
}: {
  page: string;
  game: string;
  schema: S;
}) =>
  Effect.Do.pipe(
    Effect.flatMap(() => getLiquipediaParseUrl({ game })),
    Effect.flatMap((url) =>
      Effect.serviceFunction(FetchService, (_) => _.fetch<v.Infer<S>>)(url, {
        query: {
          action: 'parse',
          page,
          format: 'json',
        },
        parseResponse:
          schema &&
          ((responseText) =>
            Effect.runSync(parseValita(schema, JSON.parse(responseText), JSON.stringify({ url })))),
      })
    ),
    Effect.flatMap(Effect.promise)
  );
