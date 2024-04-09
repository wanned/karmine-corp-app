import { HttpServer } from '@effect/platform';
import { Schema } from '@effect/schema';
import { Chunk, Console, Context, Effect, Layer, Option, Stream } from 'effect';

import { getSchedule } from '~/lib/karmine-corp-api/application/use-cases/get-schedule/get-schedule';
import { GetScheduleParamsState } from '~/lib/karmine-corp-api/application/use-cases/get-schedule/get-schedule-params-state';
import { DatabaseService } from '~/lib/karmine-corp-api/infrastructure/services/database/database-service';
import { EnvService } from '~/lib/karmine-corp-api/infrastructure/services/env/env-service';
import { FetchService } from '~/lib/karmine-corp-api/infrastructure/services/fetch/fetch-service';
import { KarmineApiService } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service';
import { LeagueOfLegendsApiService } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service';
import { OctaneApiService } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service';
import { StrafeApiService } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api-service';
import { VlrApiService } from '~/lib/karmine-corp-api/infrastructure/services/vlr-api/vlr-api-service';

export const GetScheduleRoute = () =>
  HttpServer.router.get(
    '/schedule',
    Effect.provide(GetScheduleParamsStateFromHttpRequestImpl)(
      Effect.Do.pipe(
        Effect.flatMap(() =>
          Effect.serviceFunctionEffect(DatabaseService, (_) => _.initializeTables)()
        ),
        Effect.map(() =>
          Stream.map(
            Stream.concatAll(
              Chunk.make(
                Stream.make('[\n'),
                getSchedule().pipe(
                  Stream.filter(
                    (schedule): schedule is Exclude<typeof schedule, undefined | void> =>
                      schedule !== undefined
                  ),
                  Stream.zipWithIndex,
                  Stream.map(
                    ([schedule, index]) => `${index === 0 ? '' : ',\n'}${JSON.stringify(schedule)}`
                  )
                ),
                Stream.make('\n]')
              )
            ),
            (schedule) => new TextEncoder().encode(schedule)
          )
        ),
        Effect.flatMap((schedule) =>
          getLayers([
            LeagueOfLegendsApiService,
            OctaneApiService,
            KarmineApiService,
            StrafeApiService,
            FetchService,
            DatabaseService,
            EnvService,
            GetScheduleParamsState,
            VlrApiService,
          ]).pipe(
            Effect.map((layers) =>
              schedule.pipe(Stream.provideLayer(layers), Stream.tapError(Console.error))
            ),
            Effect.map((schedule) =>
              HttpServer.response.stream(schedule, {
                contentType: 'application/json',
              })
            )
          )
        )
      )
    )
  );

const GetScheduleParamsStateFromHttpRequestImpl = Layer.effect(
  GetScheduleParamsState,
  Effect.Do.pipe(
    Effect.flatMap(
      () => Effect.serviceMembers(HttpServer.request.ServerRequest).constants.urlParamsBody
    ),
    Effect.flatMap(() => HttpServer.router.searchParams),
    Effect.map((searchParams) => HttpServer.urlParams.fromInput(searchParams)),
    Effect.map((urlParams) => {
      const getAndParseParam = <T, A extends string | undefined>(
        param: string,
        schema: Schema.Schema<T, A, never>
      ) =>
        HttpServer.urlParams
          .getFirst(urlParams, param)
          .pipe(
            (_) => Option.some(Option.getOrUndefined(_)) as any,
            Option.flatMap(Schema.decodeOption(schema))
          );

      return Option.all({
        fromDate: getAndParseParam('fromDate', Schema.orUndefined(Schema.Date)),
        toDate: getAndParseParam('toDate', Schema.orUndefined(Schema.Date)),
      });
    }),
    Effect.flatMap(
      Option.match({
        onSome: (params) =>
          Effect.succeed(
            GetScheduleParamsState.of({
              dateRange: {
                start: params.fromDate,
                end: params.toDate,
              },
            })
          ),
        onNone: () => {
          return Effect.fail('Invalid URL params');
        },
      })
    )
  )
);

const getLayers = <Layers extends Context.Tag<any, any>>(
  layers: Layers[]
): Effect.Effect<
  Layer.Layer<Layers extends { prototype: any } ? Layers['prototype'] : Layers, never, never>,
  never,
  Layers extends { prototype: any } ? Layers['prototype'] : Layers
> =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.forEach(layers, (layer) =>
        layer.pipe(Effect.map((_) => Layer.succeed(layer, layer.of(_))))
      )
    ),
    Effect.map((layers) => Layer.mergeAll(...(layers as any)))
  ) as any;
