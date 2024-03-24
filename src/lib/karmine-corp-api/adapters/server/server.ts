import { HttpServer } from '@effect/platform';
import { NodeHttpServer } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { createServer } from 'node:http';

import { GetLeaderboardsRoute } from './routes/get-leaderboards';
import { GetScheduleRoute } from './routes/get-schedule';
import { GetTeamsRoute } from './routes/get-teams';
import { createBetterSqlite3Impl } from '../../infrastructure/services/database/better-sqlite3-impl';
import { EnvService } from '../../infrastructure/services/env/env-service';
import { FetchServiceImpl } from '../../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { LiquipediaParseApiServiceImpl } from '../../infrastructure/services/liquipedia-parse-api/liquipedia-parse-api-service-impl';
import { OctaneApiServiceImpl } from '../../infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '../../infrastructure/services/strafe-api/strafe-api-service-impl';

const app = HttpServer.router.empty.pipe(
  GetScheduleRoute(),
  GetTeamsRoute(),
  GetLeaderboardsRoute()
);

const HttpServerLive = NodeHttpServer.server.layer(createServer, {
  port: 3000,
});

const AppLive = HttpServer.server
  .serve(app)
  .pipe(
    HttpServer.server.withLogAddress,
    Layer.provide(HttpServerLive),
    Layer.provide(getMainLayer())
  );

Effect.runPromise(Layer.launch(AppLive));

function getMainLayer() {
  return Layer.mergeAll(
    KarmineApiServiceImpl,
    FetchServiceImpl,
    LeagueOfLegendsApiServiceImpl,
    LiquipediaParseApiServiceImpl,
    OctaneApiServiceImpl,
    StrafeApiServiceImpl,
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
}
