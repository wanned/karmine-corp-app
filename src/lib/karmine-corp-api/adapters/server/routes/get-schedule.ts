import { HttpServer } from '@effect/platform';
import { Chunk, Context, Effect, Layer, Stream } from 'effect';

import { getSchedule } from '~/lib/karmine-corp-api/application/use-cases/get-schedule/get-schedule';
import { DatabaseService } from '~/lib/karmine-corp-api/infrastructure/services/database/database-service';
import { EnvService } from '~/lib/karmine-corp-api/infrastructure/services/env/env-service';
import { FetchService } from '~/lib/karmine-corp-api/infrastructure/services/fetch/fetch-service';
import { KarmineApiService } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service';
import { LeagueOfLegendsApiService } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service';
import { OctaneApiService } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service';
import { StrafeApiService } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api-service';

export const GetScheduleRoute = () =>
  HttpServer.router.get(
    '/schedule',
    Effect.Do.pipe(
      Effect.flatMap(() =>
        Effect.serviceFunctionEffect(DatabaseService, (_) => _.initializeTables)()
      ),
      Effect.map(() =>
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
        ).pipe(Stream.map((schedule) => new TextEncoder().encode(schedule)))
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
        ]).pipe(
          Effect.map((layers) => schedule.pipe(Stream.provideLayer(layers))),
          Effect.map((schedule) =>
            HttpServer.response.stream(schedule, {
              contentType: 'application/json',
            })
          )
        )
      )
    )
  );

const getLayers = <Layers extends Context.Tag<any, any>>(
  _layers: Layers[]
): Effect.Effect<
  Layer.Layer<Layers extends { prototype: any } ? Layers['prototype'] : Layers, never, never>,
  never,
  Layers extends { prototype: any } ? Layers['prototype'] : Layers
> => Effect.succeed(Layer.empty) as any; // NOTE: It works. I suspect that the layers are automatically passed from the parent, and that functions like Stream.provideLayer are only for type-checking.

// Effect.Do.pipe(
//   Effect.flatMap(() =>
//     Effect.forEach(layers, (layer) =>
//       layer.pipe(Effect.map((_) => Layer.succeed(layer, layer.of(_))))
//     )
//   ),
//   Effect.map((layers) => Layer.mergeAll(...(layers as any)))
// ) as any;
