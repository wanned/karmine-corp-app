import { HttpServer } from '@effect/platform';
import { NodeHttpServer } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { createServer } from 'node:http';

import { GetScheduleRoute } from './routes/get-schedule';

const app = HttpServer.router.empty.pipe(GetScheduleRoute());

const HttpServerLive = NodeHttpServer.server.layer(createServer, {
  port: 3000,
});

const AppLive = HttpServer.server
  .serve(app)
  .pipe(HttpServer.server.withLogAddress, Layer.provide(HttpServerLive));

Effect.runPromise(Layer.launch(AppLive));
