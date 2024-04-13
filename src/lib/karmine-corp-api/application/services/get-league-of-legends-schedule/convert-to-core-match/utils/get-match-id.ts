import { Effect } from 'effect';

import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';

type LeagueOfLegendsMatch = LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number];

export function getMatchId(match: LeagueOfLegendsMatch) {
  return Effect.succeed(`lol:${match.match.id}`);
}
