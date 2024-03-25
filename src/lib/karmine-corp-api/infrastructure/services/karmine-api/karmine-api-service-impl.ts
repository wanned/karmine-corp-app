import { Effect, Layer } from 'effect';
import { z } from 'zod';

import { KarmineApiService } from './karmine-api-service';
import { karmineApiSchemas } from './schemas/karmine-api-schemas';
import { parseZod } from '../../utils/parse-zod/parse-zod';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const KarmineApiServiceImpl = Layer.succeed(
  KarmineApiService,
  KarmineApiService.of({
    getEvents: () =>
      fetchKarmine({
        url: 'events',
        schema: karmineApiSchemas.getEvents,
      }),
    getEventsResults: () =>
      fetchKarmine({
        url: 'events_results',
        schema: karmineApiSchemas.getEventsResults,
      }),
    getPlayers: () =>
      fetchKarmine({
        url: 'players',
        schema: karmineApiSchemas.getPlayers,
      }),
    getTwitch: () =>
      fetchKarmine({
        url: 'twitch',
        schema: karmineApiSchemas.getTwitch,
      }),
    getGames: () =>
      fetchKarmine({
        url: 'games',
        schema: karmineApiSchemas.getGames,
      }),
  })
);

const getKarmineUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.KARMINE_API_URL}/${url}`)
  );

const fetchKarmine = <S extends z.ZodType = z.ZodAny>({
  url,
  schema,
}: {
  url: string;
  schema: S;
}) =>
  Effect.Do.pipe(
    Effect.flatMap(() => getKarmineUrl({ url })),
    Effect.flatMap((url) =>
      Effect.serviceFunction(FetchService, (_) => _.fetch<z.output<S>>)(url, {
        parseResponse:
          schema &&
          ((responseText) =>
            Effect.runSync(parseZod(schema, JSON.parse(responseText), JSON.stringify({ url })))),
      })
    ),
    Effect.flatMap((_) => Effect.promise(_))
  );
