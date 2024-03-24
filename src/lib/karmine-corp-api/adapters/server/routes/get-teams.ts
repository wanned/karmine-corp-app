import { HttpServer } from '@effect/platform';
import { Effect, Layer } from 'effect';

import { getTeams } from '~/lib/karmine-corp-api/application/use-cases/get-teams/get-teams';
import { EnvService } from '~/lib/karmine-corp-api/infrastructure/services/env/env-service';
import { FetchServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service-impl';

export const GetTeamsRoute = () =>
  HttpServer.router.get(
    '/teams',
    getMainLayer().pipe((mainLayer) =>
      Effect.provide(
        Effect.Do.pipe(
          Effect.flatMap(() => getTeams()),
          Effect.flatMap((team) => HttpServer.response.json(team))
        ),
        mainLayer
      )
    )
  );

const getMainLayer = () =>
  Layer.mergeAll(
    KarmineApiServiceImpl,
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
  );
