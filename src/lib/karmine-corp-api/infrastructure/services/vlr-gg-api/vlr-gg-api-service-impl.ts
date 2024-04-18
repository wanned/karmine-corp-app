import { Effect, Layer } from 'effect';

import { VlrGgApiService } from './vlr-gg-api-service';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const VlrGgApiServiceImpl = Layer.succeed(
  VlrGgApiService,
  VlrGgApiService.of({
    getMatches: ({ status, teamId, page }) =>
      fetchVlrGg({
        url: `team/matches/${teamId}`,
        query: {
          group: status,
          page,
        },
      }),
    getMatch: ({ gameId }) => fetchVlrGg({ url: `${gameId}` }),
    getPlayer: ({ playerId }) => fetchVlrGg({ url: `player/${playerId}` }),
  })
);

const getVlrGgUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.VLR_GG_API_URL}/${url}`)
  );

const fetchVlrGg = ({ url, query }: { url: string; query?: Record<string, any | undefined> }) =>
  Effect.Do.pipe(
    Effect.bind('envService', () => EnvService),
    Effect.bind('url', () => getVlrGgUrl({ url })),
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
