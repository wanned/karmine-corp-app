import { Effect, Layer } from 'effect';

import { VlrApiService } from './vlr-api-service';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const VlrApiServiceImpl = Layer.succeed(
  VlrApiService,
  VlrApiService.of({
    getMatches: ({ status, teamId, page }) =>
      fetchVlr({
        url: `team/matches/${teamId}`,
        query: {
          group: status,
          page,
        },
      }),
    getMatch: ({ gameId }) => fetchVlr({ url: `${gameId}` }),
    getPlayer: ({ playerId }) => fetchVlr({ url: `player/${playerId}` }),
  })
);

const getVlrUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.VLR_API_URL}/${url}`)
  );

const fetchVlr = ({ url, query }: { url: string; query?: Record<string, any | undefined> }) =>
  Effect.Do.pipe(
    Effect.bind('envService', () => EnvService),
    Effect.bind('url', () => getVlrUrl({ url })),
    Effect.flatMap(({ url }) =>
      Effect.serviceFunction(
        FetchService,
        (_) =>
          _.fetch<{
            html: string;
          }>
      )(url, {
        query: {
          hl: 'en-US',
          ...query,
        },
        parseResponse: (responseText) => ({ html: responseText }),
      })
    ),
    Effect.flatMap((_) => Effect.promise(_))
  );
