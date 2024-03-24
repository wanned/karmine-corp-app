import { HttpServer } from '@effect/platform';
import { NodeHttpServer } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { createServer } from 'node:http';

import { GetLeaderboardsRoute } from './routes/get-leaderboards';
import { GetScheduleRoute } from './routes/get-schedule';
import { GetTeamsRoute } from './routes/get-teams';

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
  .pipe(HttpServer.server.withLogAddress, Layer.provide(HttpServerLive));

Effect.runPromise(Layer.launch(AppLive));
