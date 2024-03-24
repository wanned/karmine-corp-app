import { HttpServer } from '@effect/platform';
import { Effect } from 'effect';

import { getTeams } from '~/lib/karmine-corp-api/application/use-cases/get-teams/get-teams';

export const GetTeamsRoute = () =>
  HttpServer.router.get(
    '/teams',
    Effect.Do.pipe(
      Effect.flatMap(() => getTeams()),
      Effect.flatMap((team) => HttpServer.response.json(team))
    )
  );
