import { HttpServer } from '@effect/platform';
import { Effect } from 'effect';

import { getLeaderboards } from '~/lib/karmine-corp-api/application/use-cases/get-leaderboards/get-leaderboards';

export const GetLeaderboardsRoute = () =>
  HttpServer.router.get(
    '/leaderboards',
    Effect.Do.pipe(
      Effect.flatMap(() => getLeaderboards()),
      Effect.flatMap((leaderboards) => HttpServer.response.json(leaderboards))
    )
  );
