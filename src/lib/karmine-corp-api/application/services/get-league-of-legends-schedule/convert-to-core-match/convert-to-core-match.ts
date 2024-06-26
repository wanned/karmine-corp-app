import { Effect } from 'effect';

import { getMatchDetails } from './get-match-details/get-match-details';
import { getTeams } from './get-teams/get-teams';
import { convertToCoreStatus } from './utils/convert-to-core-status';
import { getMatchId } from './utils/get-match-id';
import { CoreData } from '../../../types/core-data';

import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';

type LeagueOfLegendsMatch = LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number];

export function convertToCoreMatch(match: LeagueOfLegendsMatch) {
  return Effect.all({
    id: getMatchId(match),
    date: Effect.succeed(match.startTime),
    matchDetails: getMatchDetails(match),
    status: convertToCoreStatus(match.state),
    streamLink: Effect.succeed('kamet0'),
    teams: getTeams(match),
  }) satisfies Effect.Effect<CoreData.Match, any, any>;
}
