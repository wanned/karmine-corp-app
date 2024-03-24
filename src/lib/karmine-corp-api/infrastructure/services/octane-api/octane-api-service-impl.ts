import { Effect, Layer } from 'effect';
import { z } from 'zod';

import { OctaneApiService } from './octane-api-service';
import { octaneApiSchemas } from './schemas/octane-api-schemas';
import { parseZod } from '../../utils/parse-zod/parse-zod';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const OctaneApiServiceImpl = Layer.succeed(
  OctaneApiService,
  OctaneApiService.of({
    getMatches: ({ page, perPage, teamId }) =>
      fetchOctane({
        url: 'matches',
        query: { page, perPage, team: teamId },
        schema: octaneApiSchemas.getMatches,
      }),
    getMatchGames: ({ matchId }) =>
      fetchOctane({
        url: `matches/${matchId}/games`,
        schema: octaneApiSchemas.getMatchGames,
      }),
  })
);

const getOctaneUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.OCTANE_API_URL}/${url}`)
  );

const fetchOctane = <S extends z.ZodType = z.ZodAny>({
  url,
  query,
  schema,
}: {
  url: string;
  query?: Record<string, any | undefined>;
  schema?: S;
}) =>
  Effect.Do.pipe(
    Effect.flatMap(() => getOctaneUrl({ url })),
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
