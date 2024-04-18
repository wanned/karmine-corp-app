import { HttpServer } from '@effect/platform';
import { NodeHttpServer } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { createServer } from 'node:http';

import { GetLeaderboardsRoute } from './routes/get-leaderboards';
import { GetScheduleRoute } from './routes/get-schedule';
import { GetTeamsRoute } from './routes/get-teams';
import { createBetterSqlite3Impl } from '../../infrastructure/services/database/better-sqlite3-impl';
import { createEnvServiceImpl } from '../../infrastructure/services/env/env-service-impl';
import { FetchServiceImpl } from '../../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { LiquipediaParseApiServiceImpl } from '../../infrastructure/services/liquipedia-parse-api/liquipedia-parse-api-service-impl';
import { NotificationFcmServiceImpl } from '../../infrastructure/services/notification-sender/notification-fcm-service-impl';
import { OctaneApiServiceImpl } from '../../infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '../../infrastructure/services/strafe-api/strafe-api-service-impl';
import { VlrGgApiServiceImpl } from '../../infrastructure/services/vlr-gg-api/vlr-gg-api-service-impl';

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
  return Layer.empty.pipe(
    Layer.merge(LeagueOfLegendsApiServiceImpl),
    Layer.merge(OctaneApiServiceImpl),
    Layer.merge(KarmineApiServiceImpl),
    Layer.merge(StrafeApiServiceImpl),
    Layer.merge(LiquipediaParseApiServiceImpl),
    Layer.merge(VlrGgApiServiceImpl),
    Layer.merge(FetchServiceImpl),
    Layer.merge(createBetterSqlite3Impl()),
    Layer.merge(createEnvServiceImpl()),
    (layer) => Layer.merge(Layer.provide(NotificationFcmServiceImpl, layer), layer)
  );
}
