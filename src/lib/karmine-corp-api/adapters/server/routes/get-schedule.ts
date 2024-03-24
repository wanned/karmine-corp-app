import { HttpServer } from '@effect/platform';
import { Chunk, Effect, Layer, Stream } from 'effect';

import { getSchedule } from '~/lib/karmine-corp-api/application/use-cases/get-schedule/get-schedule';
import { createBetterSqlite3Impl } from '~/lib/karmine-corp-api/infrastructure/services/database/better-sqlite3-impl';
import { DatabaseService } from '~/lib/karmine-corp-api/infrastructure/services/database/database-service';
import { EnvService } from '~/lib/karmine-corp-api/infrastructure/services/env/env-service';
import { FetchServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { OctaneApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api-service-impl';

export const GetScheduleRoute = () =>
  HttpServer.router.get(
    '/schedule',
    getMainLayer().pipe((mainLayer) =>
      Effect.provide(
        Effect.Do.pipe(
          Effect.flatMap(() => DatabaseService.pipe(Effect.flatMap((_) => _.initializeTables()))),
          Effect.map(() =>
            HttpServer.response.setHeaders({
              'Content-Type': 'application/json',
            })
          ),
          Effect.map(() =>
            Stream.provideLayer(
              Stream.concatAll(
                Chunk.fromIterable([
                  Stream.make('[\n'),
                  getSchedule().pipe(
                    Stream.filter(
                      (schedule): schedule is Exclude<typeof schedule, undefined | void> =>
                        schedule !== undefined
                    ),
                    Stream.zipWithIndex,
                    Stream.map(
                      ([schedule, index]) =>
                        `${index === 0 ? '' : ',\n'}${JSON.stringify(schedule)}`
                    )
                  ),
                  Stream.make('\n]'),
                ])
              ).pipe(Stream.map((schedule) => new TextEncoder().encode(schedule))),
              mainLayer
            )
          ),
          Effect.map((schedule) => HttpServer.response.stream(schedule))
        ),
        mainLayer
      )
    )
  );

const getMainLayer = () =>
  Layer.mergeAll(
    LeagueOfLegendsApiServiceImpl,
    OctaneApiServiceImpl,
    KarmineApiServiceImpl,
    StrafeApiServiceImpl,
    FetchServiceImpl,
    createBetterSqlite3Impl(),
    Layer.succeed(
      EnvService,
      EnvService.of({
        getEnv: () =>
          Effect.succeed({
            OCTANE_API_URL: 'https://zsr.octane.gg',
            LOL_ESPORT_API_URL: 'https://esports-api.lolesports.com/persisted/gw',
            LOL_FEED_API_URL: 'https://feed.lolesports.com/livestats/v1',
            LOL_DATA_DRAGON_API_URL: 'https://ddragon.leagueoflegends.com',
            LOL_API_KEY: '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
            STRAFE_API_URL: 'https://flask-api.strafe.com',
            STRAFE_API_KEY:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDAwLCJpYXQiOjE2MTE2NTM0MzcuMzMzMDU5fQ.n9StQPQdpNIx3E4FKFntFuzKWolstKJRd-T4LwXmfmo',
            KARMINE_API_URL: 'https://api2.kametotv.fr/karmine',
            LIQUIPEDIA_PARSE_API_URL: 'https://liquipedia.net/<GAME>/api.php',
            LIQUIPEDIA_PARSE_URL_GAME_REPLACER: '<GAME>',
            YOUTUBE_API_URL: 'https://www.youtube.com',
          }),
      })
    )
  );
