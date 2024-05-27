import * as v from '@badrap/valita';
import { Effect, Layer } from 'effect';

import { vlrGgApiSchemas } from './schemas/vlr-gg-api-schemas';
import { VlrGgApiService } from './vlr-gg-api-service';
import { parseValita } from '../../utils/parse-valita/parse-valita';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';
import { HtmlToJsonService } from '../html-to-json/html-to-json-service';

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
    getMatch: ({ gameId }) =>
      Effect.Do.pipe(
        Effect.flatMap(() => fetchVlrGg({ url: `${gameId}` })),
        Effect.flatMap((response) =>
          Effect.serviceFunction(HtmlToJsonService, (_) => _.parse)(response.html)
        ),
        Effect.flatMap((_) => _),
        Effect.map(({ json }) => ({ data: json }))
      ),
    getPlayer: ({ playerId }) =>
      fetchVlrGgApi({ url: `players/${playerId}`, schema: vlrGgApiSchemas.getPlayer }),
  })
);

const getVlrGgUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.VLR_GG_URL}/${url}`)
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

const getVlrGgApiUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => `${env.VLR_GG_API_URL}/${url}`)
  );

const fetchVlrGgApi = <S extends v.Type = v.Type>({ url, schema }: { url: string; schema: S }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => getVlrGgApiUrl({ url })),
    Effect.flatMap((url) =>
      Effect.serviceFunction(FetchService, (_) => _.fetch<v.Infer<S>>)(url, {
        parseResponse:
          schema &&
          ((responseText) =>
            Effect.runSync(parseValita(schema, JSON.parse(responseText), JSON.stringify({ url })))),
      })
    ),
    Effect.flatMap((_) => Effect.promise(_))
  );
