import * as v from '@badrap/valita';
import destr from 'destr';
import { Console, Effect, Layer } from 'effect';

import { valorantApiSchemas } from './schemas/valorant-api-schemas';
import { ValorantApiService } from './valorant-api-service';
import { parseValita } from '../../utils/parse-valita/parse-valita';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const ValorantApiServiceImpl = Layer.succeed(ValorantApiService, {
  getAllLeagues: () =>
    fetchValorant({
      url: 'getLeaguesForStandings',
      schema: valorantApiSchemas.getAllLeagues,
    }),
  getStandings: ({ tournamentIds }) =>
    fetchValorant({
      url: 'getStandings',
      schema: valorantApiSchemas.getStandingsByTournamentId,
      query: { tournamentId: tournamentIds.join(',') },
    }),
});

const getValorantUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.VALORANT_API_URL}/${url}`)
  );

const getValorantHeaders = () =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => ({
      'x-api-key': env.VALORANT_API_KEY,
    }))
  );

const fetchValorant = <S extends v.Type = v.Type>({
  url,
  query,
  schema,
}: {
  url: string;
  query?: Record<string, any | undefined>;
  schema: S;
}) =>
  Effect.Do.pipe(
    Effect.bind('envService', () => EnvService),
    Effect.bind('url', () => getValorantUrl({ url })),
    Effect.bind('headers', () => getValorantHeaders()),
    Effect.flatMap(({ url, headers }) =>
      Effect.serviceFunction(FetchService, (_) => _.fetch<v.Infer<S>>)(url, {
        query: {
          hl: 'en-US',
          sport: 'val',
          ...query,
        },
        parseResponse:
          schema &&
          ((responseText) =>
            Effect.runSync(
              parseValita(schema, destr(responseText) || undefined, JSON.stringify({ url, query }))
            )),
        headers,
      })
    ),
    Effect.flatMap((_) => Effect.promise(_))
  );
