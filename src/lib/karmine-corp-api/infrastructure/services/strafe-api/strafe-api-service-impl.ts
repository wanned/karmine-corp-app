import destr from 'destr';
import { Effect, Layer } from 'effect';
import { z } from 'zod';

import { strafeApiSchemas } from './schemas/strafe-api-schemas';
import { StrafeApiService } from './strafe-api-service';
import { parseZod } from '../../utils/parse-zod/parse-zod';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const StrafeApiServiceImpl = Layer.succeed(
  StrafeApiService,
  StrafeApiService.of({
    getCalendar: ({ date }) =>
      fetchStrafe({
        url: `v1.7/calendar/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        schema: strafeApiSchemas.getCalendar,
      }),
    getMatch: ({ matchId }) =>
      fetchStrafe({
        url: `v2.2/match/${matchId}`,
        schema: strafeApiSchemas.getMatch,
      }),
  })
);

const getStrafeUrl = ({ url }: { url: string }) =>
  Effect.Do.pipe(
    () => EnvService,
    Effect.flatMap((envService) => envService.getEnv()),
    Effect.map((env) => `${env.STRAFE_API_URL}/${url}`)
  );

const getStrafeHeaders = () =>
  Effect.Do.pipe(
    () => EnvService,
    Effect.flatMap((envService) => envService.getEnv()),
    Effect.map((env) => ({
      Authorization: `Bearer ${env.STRAFE_API_KEY}`,
    }))
  );

const fetchStrafe = <S extends z.ZodType = z.ZodAny>({ url, schema }: { url: string; schema: S }) =>
  Effect.Do.pipe(
    Effect.bind('fetchService', () => FetchService),
    Effect.bind('url', () => getStrafeUrl({ url })),
    Effect.bind('headers', () => getStrafeHeaders()),
    Effect.flatMap(({ fetchService, url, headers }) =>
      Effect.promise(
        fetchService.fetch<z.output<S>>(url, {
          parseResponse:
            schema &&
            ((responseText) => {
              let isError = false;
              try {
                const response = JSON.parse(responseText);
                if (typeof response === 'object' && response?.hasOwnProperty('error')) {
                  isError = true;
                }
              } catch {}

              if (isError) {
                // destr is the default function that is used by ofetch to parse responses
                return destr(responseText);
              }

              return Effect.runSync(
                parseZod(schema, JSON.parse(responseText), JSON.stringify({ url }))
              );
            }),
          headers,
          retryHeader: 'Retry-After',
        })
      )
    )
  );
