import { Effect } from 'effect';

import { OctaneApi } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api';

type RocketLeagueMatch = OctaneApi.GetMatches['matches'][number];

export function getMatchId(match: RocketLeagueMatch) {
  return Effect.succeed(`rl:${match._id}`);
}
