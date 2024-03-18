import { Chunk, Effect, Layer, Match, Stream } from 'effect';
import { createServer } from 'node:http';

import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
import { EnvService } from '../../infrastructure/services/env/env-service';
import { FetchServiceImpl } from '../../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { OctaneApiServiceImpl } from '../../infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '../../infrastructure/services/strafe-api/strafe-api-service-impl';

const server = createServer(async (req, res) => {
  const handler = Match.value(req).pipe(
    endpointGetSchedule,
    Match.orElse(() => Effect.fail(new HttpError(404, 'Not found')))
  );

  try {
    await Effect.runPromise(
      Effect.match(
        Effect.catchAllDefect(handler, (defect) => Effect.fail(new HttpError(500, String(defect)))),
        {
          onFailure: (error) => {
            if (error instanceof HttpError) {
              res.writeHead(error.status, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
              return;
            }

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
          },
          onSuccess: (data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          },
        }
      )
    );
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error', message: error }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

const endpointGetSchedule = Match.when({ method: 'GET', url: '/schedule' }, () =>
  Effect.provide(
    Stream.runCollect(getSchedule()).pipe(
      Effect.map((scheduleChunk) => Chunk.toArray(scheduleChunk))
    ),
    Layer.mergeAll(
      LeagueOfLegendsApiServiceImpl,
      OctaneApiServiceImpl,
      KarmineApiServiceImpl,
      StrafeApiServiceImpl,
      FetchServiceImpl,
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
    )
  )
);
